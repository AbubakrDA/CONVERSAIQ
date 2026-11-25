<#
.SYNOPSIS
    ConversaIQ Staging Deployment Orchestrator (Windows PowerShell Default)
.DESCRIPTION
    Orchestrates Terraform plan/apply, Docker build/push to ECR, DB migrations, and ECS deployment.
    Includes a mandatory -ConfirmProvisioning safety gate so paid AWS resources are never silently created.
#>
param(
    [string]$AwsRegion = "us-east-1",
    [string]$Environment = "staging",
    [string]$ReleaseTag = "staging-$(Get-Date -Format 'yyyyMMdd-HHmmss')",
    [switch]$ConfirmProvisioning
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\..\.."

Write-Host "=== ConversaIQ Staging Deployment ($ReleaseTag) ===" -ForegroundColor Cyan
& "$scriptDir\Select-Environment.ps1"

Write-Host "`n[Step 1] Running Pre-Flight Checks..." -ForegroundColor Yellow
& "$scriptDir\Invoke-StagingPreflight.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Error "Pre-flight check failed. Resolve missing tools or environment variables before deploying."
}

if (-not $ConfirmProvisioning) {
    Write-Warning "SAFETY GATE ACTIVE: -ConfirmProvisioning switch was NOT provided."
    Write-Host "No paid AWS resources will be provisioned. Running read-only Terraform validation only." -ForegroundColor Yellow
    Push-Location "$repoRoot\infrastructure\terraform"
    terraform init -backend=false
    terraform validate
    Pop-Location
    exit 0
}

Write-Host "`n[Step 2] Provisioning Staging Infrastructure via Terraform..." -ForegroundColor Yellow
Push-Location "$repoRoot\infrastructure\terraform"
terraform init
terraform workspace select $Environment 2>$null; if ($LASTEXITCODE -ne 0) { terraform workspace new $Environment }
terraform plan -var="environment=$Environment" -var="aws_region=$AwsRegion" -out="$Environment.tfplan"
terraform apply -auto-approve "$Environment.tfplan"
$ecrBackend = terraform output -raw ecr_backend_url
$ecrFrontend = terraform output -raw ecr_frontend_url
$ecsCluster = terraform output -raw ecs_cluster_name
Pop-Location

Write-Host "`n[Step 3] Building & Pushing Hardened Multi-Stage Containers to ECR..." -ForegroundColor Yellow
$accountId = (aws sts get-caller-identity --query Account --output text)
aws ecr get-login-password --region $AwsRegion | docker login --username AWS --password-stdin "$accountId.dkr.ecr.$AwsRegion.amazonaws.com"

docker build -t "${ecrBackend}:${ReleaseTag}" -f "$repoRoot\backend\Dockerfile.prod" "$repoRoot\backend"
docker push "${ecrBackend}:${ReleaseTag}"

docker build -t "${ecrFrontend}:${ReleaseTag}" -f "$repoRoot\frontend\Dockerfile.prod" "$repoRoot\frontend"
docker push "${ecrFrontend}:${ReleaseTag}"

Write-Host "`n[Step 4] Updating ECS Fargate Services..." -ForegroundColor Yellow
aws ecs update-service --cluster $ecsCluster --service "conversaiq-$Environment-web" --force-new-deployment --region $AwsRegion
aws ecs update-service --cluster $ecsCluster --service "conversaiq-$Environment-worker" --force-new-deployment --region $AwsRegion

Write-Host "`nStaging deployment triggered successfully for tag $ReleaseTag." -ForegroundColor Green
