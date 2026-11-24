variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS Region"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Deployment environment"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.0.0.0/16"
  description = "VPC CIDR block"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "Amazon RDS PostgreSQL master password"
}

variable "domain_name" {
  type        = string
  default     = "conversaiq.com"
  description = "Apex domain name for CloudFront and ALB Route 53 records"
}
