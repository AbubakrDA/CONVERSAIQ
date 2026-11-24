output "vpc_id" {
  value       = aws_vpc.main.id
  description = "ID of the main VPC"
}

output "rds_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "Connection endpoint for PostgreSQL database"
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.tenant_storage.id
  description = "Private S3 bucket name for tenant files"
}

output "ecs_cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "Name of the ECS Fargate cluster"
}
