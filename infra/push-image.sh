#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# GhostFrame — Build & Push Docker Image to AWS ECR
#
# Run this every time you update the ai-service code.
# The new image will be used by all future AWS Batch jobs automatically.
#
# Usage:
#   chmod +x infra/push-image.sh
#   ./infra/push-image.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME="ghostframe-ai"
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"

echo "=================================================="
echo " GhostFrame — Docker Build & Push"
echo " Target: $ECR_URI:latest"
echo "=================================================="

# ── Step 1: Authenticate Docker with ECR ──────────────────────────────────────
echo ""
echo "[1/3] Authenticating Docker with ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
echo "  ✅ Docker authenticated with ECR"

# ── Step 2: Build the Docker image ────────────────────────────────────────────
echo ""
echo "[2/3] Building Docker image (this may take 5-15 min on first run)..."
echo "      The model weights (~176MB) are pre-downloaded during build."
cd "$(dirname "$0")/../ai-service"

docker build \
  --platform linux/amd64 \
  -t "$ECR_REPO_NAME:latest" \
  -t "$ECR_URI:latest" \
  .

echo "  ✅ Docker image built successfully"

# ── Step 3: Push to ECR ───────────────────────────────────────────────────────
echo ""
echo "[3/3] Pushing image to ECR..."
docker push "$ECR_URI:latest"
echo "  ✅ Image pushed: $ECR_URI:latest"

echo ""
echo "=================================================="
echo " ✅ Done! New image is live in ECR."
echo " All new AWS Batch jobs will use this image."
echo " (Existing running jobs are unaffected)"
echo "=================================================="
