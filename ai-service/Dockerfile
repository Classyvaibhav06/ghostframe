# ─── Stage 1: Builder ────────────────────────────────────────────────────────
# Use a full python image to install heavy dependencies with compiled extensions
FROM python:3.11-slim AS builder

WORKDIR /app

# Install OS-level build tools needed by some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# ─── Pre-download the rembg u2net model weights ──────────────────────────────
# Doing this at build time avoids a cold-start timeout on the first job.
# The model is ~176MB and will be cached in /root/.u2net/
RUN python -c "from rembg import new_session; new_session('u2net'); print('Model downloaded successfully.')"

# ─── Stage 2: Runtime ────────────────────────────────────────────────────────
FROM python:3.11-slim AS runtime

WORKDIR /app

# Install only runtime OS dependencies (no build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy installed Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy the pre-downloaded model weights from builder
COPY --from=builder /root/.u2net /root/.u2net

# Copy application code
COPY job.py .
COPY inference.py .

# Environment variables (values will be injected by AWS Batch at runtime)
ENV TASK_ID=""
ENV S3_INPUT_KEY=""
ENV MEDIA_TYPE="video"
ENV NODE_API_URL=""
ENV AWS_REGION="ap-south-1"
ENV S3_BUCKET_NAME=""

# This container runs once, processes one job, then exits.
CMD ["python", "job.py"]
