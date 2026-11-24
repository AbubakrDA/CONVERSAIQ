# ConversaIQ — Production Deployment & Operations Guide

## 1. Production Architecture Overview
ConversaIQ is engineered as a secure, containerized, multi-tenant cloud platform deployed on AWS using **ECS Fargate**, **RDS PostgreSQL 16 (with pgvector)**, **ElastiCache Redis 7**, **S3 Encrypted Buckets**, **CloudFront CDN**, and an **Application Load Balancer (ALB)**.

```mermaid
flowchart TD
    Client["HTTPS Clients & Browsers"] --> CF["AWS CloudFront CDN"]
    CF --> S3Static["S3 Frontend Bucket (SPA Assets)"]
    CF --> ALB["AWS Application Load Balancer (TLS 1.3)"]
    
    subgraph VPC["AWS Production VPC (10.0.0.0/16)"]
        subgraph PublicSubnets["Public Subnets"]
            ALB
        end
        
        subgraph AppSubnets["Private App Subnets"]
            ECSWeb["ECS Fargate: Web API (FastAPI)"]
            ECSWorker["ECS Fargate: Celery Task Workers"]
        end
        
        subgraph DBSubnets["Isolated Database Subnets"]
            RDS["RDS PostgreSQL 16 + pgvector"]
            Redis["ElastiCache Redis 7 Cluster"]
        end
    end

    ECSWeb --> RDS
    ECSWeb --> Redis
    ECSWorker --> RDS
    ECSWorker --> Redis
    ECSWeb --> S3Docs["S3 Private Storage (SSE-KMS)"]
```

---

## 2. Infrastructure Deployment Sequence

### Step 1: Provision Infrastructure via Terraform
```bash
cd infrastructure/terraform

# Initialize Terraform providers
terraform init

# Plan production infrastructure
terraform plan -var="environment=production" -out=tfplan

# Apply configuration
terraform apply tfplan
```

### Step 2: Configure Environment Variables & Secrets
Secrets are securely fetched from **AWS Secrets Manager** at task startup:
```ini
ENVIRONMENT=production
DATABASE_URL=postgresql+asyncpg://conversaiq_admin:SECURE_PASSWORD@conversaiq-prod-db.c123.us-east-1.rds.amazonaws.com:5432/conversaiq
REDIS_URL=rediss://conversaiq-prod-redis.c123.us-east-1.cache.amazonaws.com:6379/0
SECRET_KEY=SECURE_256_BIT_HEX_KEY
S3_BUCKET_NAME=conversaiq-documents-production
BACKEND_CORS_ORIGINS=["https://app.conversaiq.com","https://admin.conversaiq.com"]
```

### Step 3: Database Migration Execution
Run database migrations within an ephemeral ECS Fargate task:
```bash
aws ecs run-task \
  --cluster conversaiq-production-cluster \
  --task-definition conversaiq-migration-task \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-abc123],securityGroups=[sg-def456],assignPublicIp=DISABLED}" \
  --overrides '{"containerOverrides": [{"name": "migrator", "command": ["alembic", "upgrade", "head"]}]}'
```

### Step 4: Deploy Container Services
Push hardened multi-stage Docker images to Amazon Elastic Container Registry (ECR):
```bash
# Authenticate Docker to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build and tag backend
docker build -t conversaiq-backend:latest -f backend/Dockerfile.prod backend/
docker tag conversaiq-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/conversaiq-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/conversaiq-backend:latest

# Trigger zero-downtime rolling update
aws ecs update-service \
  --cluster conversaiq-production-cluster \
  --service conversaiq-web-service \
  --force-new-deployment
```

---

## 3. Operational Health & Telemetry Verification

### Health Check Verification
- API Health: `GET /api/v1/health` -> Returns `{"status": "healthy"}`.
- Live Infrastructure Dashboard: `GET /api/v1/infrastructure/dashboard` -> Returns status across all 6 core services and RPO/RTO metrics.
- Backup Status: `GET /api/v1/backup/status` -> Returns live backup compliance and GFS rotation state.

### Automated Rollback Criteria
An automated deployment rollback is triggered immediately if:
1. ALB target health checks fail for > 120 seconds.
2. Container error rate spikes above 1% over a 5-minute rolling window.
3. Database connection pool errors or timeouts are encountered.
