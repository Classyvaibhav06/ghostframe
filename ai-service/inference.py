import os
import cv2
import numpy as np
import imageio
import requests
from rembg import remove, new_session

# Create a global session for rembg to avoid reloading the model per frame
print("Loading AI Model (U-2-Net via rembg)...")
session = new_session("u2net")

def process_video(input_path, task_id):
    print(f"Starting video processing for {input_path} with rembg")
    
    output_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'outputs'))
    os.makedirs(output_dir, exist_ok=True)
    
    # Use WebM for transparency support
    output_filename = f"processed_{task_id}.webm"
    output_path = os.path.join(output_dir, output_filename)
    
    cap = cv2.VideoCapture(input_path)
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
        output_path, 
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
                    try:
                        requests.post('http://localhost:5000/api/video/progress', json={
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
    
    print(f"Finished visual processing. Output saved to {output_path}")
    
    # Re-add the original audio track back to the final video using FFmpeg
    try:
        import subprocess
        
        # Try to use imageio-ffmpeg's built-in binary, otherwise fallback to system ffmpeg
        try:
            import imageio_ffmpeg
            ffmpeg_cmd = imageio_ffmpeg.get_ffmpeg_exe()
        except ImportError:
            ffmpeg_cmd = "ffmpeg"

        final_output_path = output_path.replace(".webm", "_audio.webm")
        cmd = [
            ffmpeg_cmd, "-y", 
            "-i", output_path,          # The silent processed WebM
            "-i", input_path,           # The original MP4/video with audio
            "-map", "0:v:0",            # Take video track from the WebM
            "-map", "1:a:0?",           # Take audio track from the original
            "-c:v", "copy",             # Keep the transparent video exactly as-is
            "-c:a", "libvorbis",        # Compress audio for WebM compatibility
            final_output_path
        ]
        print("Muxing audio back into video...")
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        if result.returncode == 0 and os.path.exists(final_output_path):
            os.replace(final_output_path, output_path)
            print("Successfully added audio back.")
        else:
            print("Original video had no audio or muxing failed. Proceeding with silent video.")
    except Exception as e:
        print(f"Failed to add audio: {e}")

    return output_path
