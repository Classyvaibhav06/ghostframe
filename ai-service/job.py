"""
GhostFrame AI Batch Job — job.py

This script is the Docker container entrypoint for AWS Batch / ECS Fargate.
It reads job parameters from environment variables (injected by AWS Batch),
processes one video or image, then exits.

Environment variables (injected by AWS Batch Job Definition):
  TASK_ID        - MongoDB task _id (used as identifier throughout)
  S3_INPUT_KEY   - The S3 key of the uploaded file (e.g. uploads/user123/abc.mp4)
  MEDIA_TYPE     - 'video' or 'image'
  NODE_API_URL   - Base URL of the Node.js API (e.g. http://65.0.109.199:5000)
  S3_BUCKET_NAME - S3 bucket name
  AWS_REGION     - AWS region (default: ap-south-1)
"""

import os
import sys
import requests

def notify_node(node_api_url: str, task_id: str, status: str, output_path: str = None, error: str = None):
    """
    POST a completion or failure notification back to the Node.js API.
    The Node.js server will update MongoDB and emit a Socket.io event to the frontend.
    """
    if not node_api_url:
        print("Warning: NODE_API_URL not set, skipping callback.", flush=True)
        return

    payload = {
        "taskId": task_id,
        "status": status,
    }
    if output_path:
        payload["outputPath"] = output_path
    if error:
        payload["errorMessage"] = error

    try:
        response = requests.post(
            f"{node_api_url}/api/video/batch-complete",
            json=payload,
            timeout=15
        )
        print(f"Notified Node.js API: {response.status_code}", flush=True)
    except Exception as e:
        # Not fatal — the job still succeeded. Node.js can poll as a fallback.
        print(f"Warning: Could not notify Node.js API: {e}", flush=True)


def main():
    # ── Read job parameters from environment ──────────────────────────────────
    task_id      = os.environ.get("TASK_ID", "").strip()
    s3_input_key = os.environ.get("S3_INPUT_KEY", "").strip()
    media_type   = os.environ.get("MEDIA_TYPE", "video").strip().lower()
    node_api_url = os.environ.get("NODE_API_URL", "").strip()

    print(f"Starting GhostFrame batch job", flush=True)
    print(f"  TASK_ID      : {task_id}", flush=True)
    print(f"  S3_INPUT_KEY : {s3_input_key}", flush=True)
    print(f"  MEDIA_TYPE   : {media_type}", flush=True)
    print(f"  NODE_API_URL : {node_api_url}", flush=True)

    # ── Validate inputs ────────────────────────────────────────────────────────
    if not task_id or not s3_input_key:
        print("FATAL: TASK_ID and S3_INPUT_KEY are required.", flush=True)
        sys.exit(1)

    # ── Import inference module (this also loads the rembg model) ─────────────
    # Import here so that model load happens after env vars are confirmed valid.
    print("Loading AI model...", flush=True)
    from inference import process_video, process_image

    # ── Run the appropriate processor ─────────────────────────────────────────
    try:
        if media_type == "image":
            print("Processing image...", flush=True)
            output_s3_key = process_image(s3_input_key, task_id)
        else:
            print("Processing video...", flush=True)
            output_s3_key = process_video(s3_input_key, task_id)

        print(f"Job completed successfully. Output: {output_s3_key}", flush=True)

        # Notify Node.js that the job is done
        notify_node(node_api_url, task_id, "completed", output_path=output_s3_key)

        sys.exit(0)

    except Exception as e:
        print(f"FATAL: Job failed with error: {e}", flush=True)

        # Notify Node.js of the failure
        notify_node(node_api_url, task_id, "failed", error=str(e))

        sys.exit(1)


if __name__ == "__main__":
    main()
