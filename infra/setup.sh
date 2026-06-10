#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# GhostFrame — AWS Infrastructure Setup Script
# 
# Run this ONCE to provision all AWS resources needed for the Batch + Fargate
# AI processing pipeline. Safe to re-run (uses --no-fail-on-empty for queries).
#
# Prerequisites:
#   - AWS CLI v2 installed and configured (aws configure)
#   - Your AWS Account ID ready
#   - Docker installed
#
# Usage:
#   chmod +x infra/setup.sh
#   ./infra/setup.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e  # Exit on any error

# ── Configuration ─────────────────────────────────────────────────────────────
AWS_REGION="ap-south-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_NAME="ghostframe-ai"
SQS_QUEUE_NAME="ghostframe-video-jobs"
BATCH_COMPUTE_ENV_NAME="ghostframe-fargate-env"
BATCH_JOB_QUEUE_NAME="ghostframe-job-queue"
BATCH_JOB_DEF_NAME="ghostframe-ai-job"
IAM_ROLE_NAME="GhostFrameBatchExecutionRole"

echo "=================================================="
echo " GhostFrame Infrastructure Setup"
echo " Region:     $AWS_REGION"
echo " Account ID: $AWS_ACCOUNT_ID"
echo "=================================================="

# ── Step 1: Create ECR Repository ─────────────────────────────────────────────
echo ""
echo "[1/6] Creating ECR repository: $ECR_REPO_NAME ..."
ECR_URI=$(aws ecr describe-repositories \
  --repository-names "$ECR_REPO_NAME" \
  --region "$AWS_REGION" \
  --query "repositories[0].repositoryUri" \
  --output text 2>/dev/null || true)

if [ -z "$ECR_URI" ] || [ "$ECR_URI" = "None" ]; then
  ECR_URI=$(aws ecr create-repository \
    --repository-name "$ECR_REPO_NAME" \
    --region "$AWS_REGION" \
    --image-scanning-configuration scanOnPush=true \
    --query "repository.repositoryUri" \
    --output text)
  echo "  ✅ Created ECR repository: $ECR_URI"
else
  echo "  ✅ ECR repository already exists: $ECR_URI"
fi

# ── Step 2: Create SQS Queue ──────────────────────────────────────────────────
echo ""
echo "[2/6] Creating SQS queue: $SQS_QUEUE_NAME ..."
SQS_QUEUE_URL=$(aws sqs create-queue \
  --queue-name "$SQS_QUEUE_NAME" \
  --attributes VisibilityTimeout=3600 \
  --region "$AWS_REGION" \
  --query "QueueUrl" \
  --output text 2>/dev/null || \
  aws sqs get-queue-url \
    --queue-name "$SQS_QUEUE_NAME" \
    --region "$AWS_REGION" \
    --query "QueueUrl" \
    --output text)

echo "  ✅ SQS Queue URL: $SQS_QUEUE_URL"

# ── Step 3: Create IAM Role for Batch & Fargate ───────────────────────────────
echo ""
echo "[3/6] Creating IAM execution role: $IAM_ROLE_NAME ..."

TRUST_POLICY='{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": [
          "ecs-tasks.amazonaws.com",
          "batch.amazonaws.com"
        ]
      },
      "Action": "sts:AssumeRole"
    }
  ]
}'

ROLE_ARN=$(aws iam get-role \
  --role-name "$IAM_ROLE_NAME" \
  --query "Role.Arn" \
  --output text 2>/dev/null || true)

if [ -z "$ROLE_ARN" ] || [ "$ROLE_ARN" = "None" ]; then
  ROLE_ARN=$(aws iam create-role \
    --role-name "$IAM_ROLE_NAME" \
    --assume-role-policy-document "$TRUST_POLICY" \
    --query "Role.Arn" \
    --output text)

  # Attach AWS managed policies
  aws iam attach-role-policy --role-name "$IAM_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  aws iam attach-role-policy --role-name "$IAM_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/AmazonS3FullAccess"
  aws iam attach-role-policy --role-name "$IAM_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/AmazonSQSFullAccess"
  aws iam attach-role-policy --role-name "$IAM_ROLE_NAME" --policy-arn "arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"

  echo "  ✅ Created IAM role: $ROLE_ARN"
else
  echo "  ✅ IAM role already exists: $ROLE_ARN"
fi

# ── Step 4: Create AWS Batch Compute Environment (Fargate) ────────────────────
echo ""
echo "[4/6] Creating Batch Compute Environment: $BATCH_COMPUTE_ENV_NAME ..."

# Get default VPC and subnets
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" \
  --query "Vpcs[0].VpcId" --output text --region "$AWS_REGION")
SUBNETS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[*].SubnetId" --output text --region "$AWS_REGION" | tr '\t' ',')

COMPUTE_ENV_EXISTS=$(aws batch describe-compute-environments \
  --compute-environments "$BATCH_COMPUTE_ENV_NAME" \
  --region "$AWS_REGION" \
  --query "computeEnvironments[0].computeEnvironmentName" \
  --output text 2>/dev/null || true)

if [ -z "$COMPUTE_ENV_EXISTS" ] || [ "$COMPUTE_ENV_EXISTS" = "None" ]; then
  aws batch create-compute-environment \
    --compute-environment-name "$BATCH_COMPUTE_ENV_NAME" \
    --type MANAGED \
    --state ENABLED \
    --compute-resources "{
      \"type\": \"FARGATE\",
      \"maxvCpus\": 256,
      \"subnets\": [$(echo $SUBNETS | sed 's/,/\",\"/g' | sed 's/^/\"/' | sed 's/$/\"/')],
      \"securityGroupIds\": [],
      \"tags\": {\"Project\": \"GhostFrame\"}
    }" \
    --service-role "arn:aws:iam::${AWS_ACCOUNT_ID}:role/AWSBatchServiceRole" \
    --region "$AWS_REGION"
  echo "  ✅ Created Batch Compute Environment"
else
  echo "  ✅ Compute Environment already exists"
fi

# ── Step 5: Create Batch Job Queue ────────────────────────────────────────────
echo ""
echo "[5/6] Creating Batch Job Queue: $BATCH_JOB_QUEUE_NAME ..."

JOB_QUEUE_EXISTS=$(aws batch describe-job-queues \
  --job-queues "$BATCH_JOB_QUEUE_NAME" \
  --region "$AWS_REGION" \
  --query "jobQueues[0].jobQueueName" \
  --output text 2>/dev/null || true)

if [ -z "$JOB_QUEUE_EXISTS" ] || [ "$JOB_QUEUE_EXISTS" = "None" ]; then
  aws batch create-job-queue \
    --job-queue-name "$BATCH_JOB_QUEUE_NAME" \
    --state ENABLED \
    --priority 1 \
    --compute-environment-order "[{\"order\": 1, \"computeEnvironment\": \"$BATCH_COMPUTE_ENV_NAME\"}]" \
    --region "$AWS_REGION"
  echo "  ✅ Created Batch Job Queue"
else
  echo "  ✅ Job Queue already exists"
fi

# ── Step 6: Register Batch Job Definition ─────────────────────────────────────
echo ""
echo "[6/6] Registering Batch Job Definition: $BATCH_JOB_DEF_NAME ..."
echo "      Docker Image: $ECR_URI:latest"

aws batch register-job-definition \
  --job-definition-name "$BATCH_JOB_DEF_NAME" \
  --type container \
  --platform-capabilities FARGATE \
  --container-properties "{
    \"image\": \"$ECR_URI:latest\",
    \"resourceRequirements\": [
      {\"type\": \"VCPU\", \"value\": \"4\"},
      {\"type\": \"MEMORY\", \"value\": \"8192\"}
    ],
    \"executionRoleArn\": \"$ROLE_ARN\",
    \"jobRoleArn\": \"$ROLE_ARN\",
    \"networkConfiguration\": {
      \"assignPublicIp\": \"ENABLED\"
    },
    \"logConfiguration\": {
      \"logDriver\": \"awslogs\",
      \"options\": {
        \"awslogs-group\": \"/aws/batch/ghostframe-ai\",
        \"awslogs-region\": \"$AWS_REGION\",
        \"awslogs-stream-prefix\": \"ghostframe\"
      }
    },
    \"environment\": [
      {\"name\": \"AWS_REGION\", \"value\": \"$AWS_REGION\"},
      {\"name\": \"S3_BUCKET_NAME\", \"value\": \"ghostframe-uploads-2026\"}
    ],
    \"secrets\": [
      {\"name\": \"AWS_ACCESS_KEY_ID\", \"valueFrom\": \"arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/ghostframe/AWS_ACCESS_KEY_ID\"},
      {\"name\": \"AWS_SECRET_ACCESS_KEY\", \"valueFrom\": \"arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/ghostframe/AWS_SECRET_ACCESS_KEY\"},
      {\"name\": \"BATCH_CALLBACK_SECRET\", \"valueFrom\": \"arn:aws:ssm:$AWS_REGION:$AWS_ACCOUNT_ID:parameter/ghostframe/BATCH_CALLBACK_SECRET\"}
    ]
  }" \
  --region "$AWS_REGION"

echo "  ✅ Registered Batch Job Definition"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "=================================================="
echo " ✅ ALL DONE! Add these to your .env files:"
echo "=================================================="
echo ""
echo " Server (.env):"
echo "   SQS_QUEUE_URL=$SQS_QUEUE_URL"
echo "   NODE_API_URL=http://65.0.109.199:5000"
echo "   BATCH_CALLBACK_SECRET=<generate a random string>"
echo "   BATCH_JOB_QUEUE=$BATCH_JOB_QUEUE_NAME"
echo "   BATCH_JOB_DEFINITION=$BATCH_JOB_DEF_NAME"
echo ""
echo " Next step: Build & push the Docker image:"
echo "   ./infra/push-image.sh"
echo "=================================================="
