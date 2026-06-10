import os
import cv2
import numpy as np
import imageio
import requests
import boto3
import uuid
from rembg import remove, new_session

# NOTE: In Docker/Fargate, env vars are injected by AWS Batch — no .env file needed.
# For local development, set env vars manually or use a .env loader in your shell.

# Initialize S3 Client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION', 'ap-south-1')
)
BUCKET_NAME = os.getenv('S3_BUCKET_NAME')

def download_from_s3(s3_key):
    temp_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'outputs'))
    os.makedirs(temp_dir, exist_ok=True)
    ext = s3_key.split('.')[-1]
    local_path = os.path.join(temp_dir, f"temp_in_{uuid.uuid4().hex}.{ext}")
    print(f"Downloading {s3_key} from S3...")
    s3_client.download_file(BUCKET_NAME, s3_key, local_path)
    return local_path

def upload_to_s3(local_path, s3_key, content_type):
    print(f"Uploading to S3: {s3_key}...")
    s3_client.upload_file(local_path, BUCKET_NAME, s3_key, ExtraArgs={'ContentType': content_type})

# Create a global session for rembg to avoid reloading the model per frame
print("Loading AI Model (U-2-Net via rembg)...")
session = new_session("u2net")

def process_video(s3_key, task_id):
    print(f"Starting video processing for S3 Key: {s3_key}")
    
    # Download from S3
    local_input = download_from_s3(s3_key)
    
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'outputs'))
    
    # Use WebM for transparency support
    local_output = os.path.join(output_dir, f"temp_out_{uuid.uuid4().hex}.webm")
    
    cap = cv2.VideoCapture(local_input)
    if not cap.isOpened():
        raise Exception("Could not open video file.")
        
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if fps == 0 or np.isnan(fps):
        fps = 30.0
        
    # Process at full native resolution to maximize quality
    # This will use much more compute power on the PC
    process_scale = 1.0 
    p_width = int(width * process_scale)
    p_height = int(height * process_scale)
    
    # Use imageio to write transparent WebM video
    # 'libvpx' handles VP8, or 'libvpx-vp9' for VP9. yuva420p format allows alpha channel.
    writer = imageio.get_writer(
        local_output, 
        fps=fps, 
        codec='libvpx-vp9', 
        pixelformat='yuva420p',
        macro_block_size=None
    )
    
    frame_count = 0
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
                
            frame_count += 1
            if frame_count % 30 == 0:
                print(f"Processed {frame_count}/{total_frames} frames...", flush=True)
                # Send progress to Node.js server webhook
                if total_frames > 0:
                    # max 99 so it doesn't say 100% until fully saved
                    progress = min(99, int((frame_count / total_frames) * 100))
                    # NODE_API_URL is injected by AWS Batch (e.g. http://65.0.109.199:5000)
                    node_api_url = os.getenv('NODE_API_URL', '').strip()
                    if node_api_url:
                        try:
                            requests.post(f'{node_api_url}/api/video/progress', json={
                                "taskId": task_id,
                                "progress": progress
                            }, timeout=2)
                        except Exception as e:
                            print(f"Could not send progress: {e}")
                
            # Resize for processing
            small_frame = cv2.resize(frame, (p_width, p_height))
            
            # rembg expects BGR or RGB depending on the input type, usually works best with BGR from cv2
            # remove() returns RGBA
            output = remove(small_frame, session=session)
            
            # The output is RGBA
            alpha_channel = output[:, :, 3]
            bgr_foreground = output[:, :, :3]
            
            # Resize the alpha and foreground back to original size
            alpha_resized = cv2.resize(alpha_channel, (width, height), interpolation=cv2.INTER_LINEAR)
            fg_resized = cv2.resize(bgr_foreground, (width, height), interpolation=cv2.INTER_LINEAR)
            
            # Convert BGR foreground to RGB since imageio expects RGB(A)
            rgb_fg = cv2.cvtColor(fg_resized, cv2.COLOR_BGR2RGB)
            
            # Stack into a final RGBA image
            rgba_frame = np.dstack((rgb_fg, alpha_resized))
            
            writer.append_data(rgba_frame)
            
    except Exception as e:
        print(f"Error processing frame: {e}")
        cap.release()
        writer.close()
        raise e
        
    cap.release()
    writer.close()
    
    print(f"Finished visual processing. Saved locally to {local_output}")
    
    # Re-add the original audio track back to the final video using FFmpeg
    try:
        import subprocess
        
        # Try to use imageio-ffmpeg's built-in binary, otherwise fallback to system ffmpeg
        try:
            import imageio_ffmpeg
            ffmpeg_cmd = imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            ffmpeg_cmd = "ffmpeg"

        final_local_output = local_output.replace(".webm", "_audio.webm")
        cmd = [
            ffmpeg_cmd, "-y", 
            "-i", local_output,          # The silent processed WebM
            "-i", local_input,           # The original MP4/video with audio
            "-map", "0:v:0",             # Take video track from the WebM
            "-map", "1:a:0?",            # Take audio track from the original
            "-c:v", "copy",              # Keep the transparent video exactly as-is
            "-c:a", "libvorbis",         # Compress audio for WebM compatibility
            final_local_output
        ]
        print("Muxing audio back into video...")
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode == 0 and os.path.exists(final_local_output):
            os.replace(final_local_output, local_output)
            print("Successfully added audio back.")
        else:
            print("Original video had no audio or muxing failed. Proceeding with silent video.")
    except Exception as e:
        print(f"Failed to add audio: {e}")

    # Upload final output to S3
    output_s3_key = f"outputs/{task_id}/processed.webm"
    upload_to_s3(local_output, output_s3_key, 'video/webm')
    
    # Cleanup local temporary files
    try:
        os.remove(local_input)
        os.remove(local_output)
        print("Cleaned up local temporary files.")
    except Exception as e:
        print(f"Warning: Could not cleanup local files: {e}")

    return output_s3_key

def process_image(s3_key, task_id):
    print(f"Starting image processing for S3 Key: {s3_key}")
    
    local_input = download_from_s3(s3_key)
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'outputs'))
    local_output = os.path.join(output_dir, f"temp_out_{uuid.uuid4().hex}.png")
    
    # Read the image using cv2
    img = cv2.imread(local_input)
    if img is None:
        raise Exception(f"Could not open image file from S3: {s3_key}")
        
    try:
        output = remove(img, session=session)
        cv2.imwrite(local_output, output)
        
        # Upload to S3
        output_s3_key = f"outputs/{task_id}/processed.png"
        upload_to_s3(local_output, output_s3_key, 'image/png')
        
        # Cleanup
        os.remove(local_input)
        os.remove(local_output)
        
        return output_s3_key
    except Exception as e:
        print(f"Error processing image: {e}")
        raise e
