import boto3
import os
import sys
from dotenv import load_dotenv

# Load env variables from root .env
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(dotenv_path)

# Ensure AWS Credentials are set
aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_key = os.getenv('AWS_SECRET_ACCESS_KEY')
aws_region = os.getenv('AWS_REGION', 'ap-south-1')

if not aws_access_key or not aws_secret_key:
    print("❌ Error: AWS credentials not found in .env file.")
    sys.exit(1)

# Initialize AWS Batch Client
batch = boto3.client(
    'batch',
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key,
    region_name=aws_region
)

JOB_NAME = 'ghostframe-ai-job'
NEW_VCPU = '8'
NEW_MEMORY = '16384'

try:
    print(f"🔄 Describing active job definition '{JOB_NAME}'...")
    response = batch.describe_job_definitions(
        jobDefinitionName=JOB_NAME,
        status='ACTIVE'
    )
    
    job_defs = response.get('jobDefinitions', [])
    if not job_defs:
        print(f"❌ Error: No active job definitions found for name '{JOB_NAME}'.")
        sys.exit(1)
        
    # Get the latest revision (highest revision number)
    latest_job_def = sorted(job_defs, key=lambda x: x['revision'])[-1]
    print(f"ℹ️ Found latest revision: {latest_job_def['jobDefinitionName']}:{latest_job_def['revision']}")
    
    # Get the container properties
    container_props = latest_job_def['containerProperties']
    
    # Update resource requirements (VCPU and MEMORY)
    updated_requirements = [
        {"type": "VCPU", "value": NEW_VCPU},
        {"type": "MEMORY", "value": NEW_MEMORY}
    ]
    container_props['resourceRequirements'] = updated_requirements
    
    # Register the new revision
    print(f"🚀 Registering new revision for '{JOB_NAME}' with 8 vCPUs and 16 GB RAM...")
    reg_response = batch.register_job_definition(
        jobDefinitionName=JOB_NAME,
        type=latest_job_def['type'],
        containerProperties=container_props,
        platformCapabilities=latest_job_def.get('platformCapabilities', ['FARGATE'])
    )
    
    print(f"✅ SUCCESS! New job definition revision registered:")
    print(f"   Name:     {reg_response['jobDefinitionName']}")
    print(f"   Revision: {reg_response['revision']}")
    print(f"   ARN:      {reg_response['jobDefinitionArn']}")

except Exception as e:
    print(f"❌ Error updating job definition: {e}")
    sys.exit(1)
