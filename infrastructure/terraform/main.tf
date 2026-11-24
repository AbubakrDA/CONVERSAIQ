terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "ConversaIQ"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# ==========================================
# 1. VPC & Networking
# ==========================================
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "conversaiq-${var.environment}-vpc"
  }
}

resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true
}

resource "aws_subnet" "private_a" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "private_b" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.11.0/24"
  availability_zone = "${var.aws_region}b"
}

# ==========================================
# 2. Security Groups
# ==========================================
resource "aws_security_group" "alb" {
  name        = "conversaiq-${var.environment}-alb-sg"
  description = "Public ALB ingress"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ecs_tasks" {
  name        = "conversaiq-${var.environment}-ecs-sg"
  description = "Ingress from ALB only"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ==========================================
# 3. Amazon RDS PostgreSQL 16 + pgvector
# ==========================================
resource "aws_db_subnet_group" "rds" {
  name       = "conversaiq-${var.environment}-db-subnet"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]
}

resource "aws_db_instance" "postgres" {
  identifier            = "conversaiq-${var.environment}-db"
  allocated_storage     = 100
  max_allocated_storage = 500
  engine                = "postgres"
  engine_version        = "16.3"
  instance_class        = "db.r6g.xlarge"
  db_name               = "conversaiq_db"
  username              = "postgres"
  password              = var.db_password
  db_subnet_group_name  = aws_db_subnet_group.rds.name
  multi_az              = true
  storage_encrypted     = true
  skip_final_snapshot   = false
  deletion_protection   = true
}

# ==========================================
# 4. Amazon S3 Private Tenant Storage
# ==========================================
resource "aws_s3_bucket" "tenant_storage" {
  bucket = "conversaiq-${var.environment}-tenant-storage"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_enc" {
  bucket = aws_s3_bucket.tenant_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "s3_block" {
  bucket                  = aws_s3_bucket.tenant_storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ==========================================
# 5. ECS Fargate Cluster & Application Services
# ==========================================
resource "aws_ecs_cluster" "main" {
  name = "conversaiq-${var.environment}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name              = "/ecs/conversaiq-${var.environment}"
  retention_in_days = 90
}
