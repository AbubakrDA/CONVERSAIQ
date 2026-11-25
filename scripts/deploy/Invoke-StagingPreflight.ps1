<#
.SYNOPSIS
    ConversaIQ Phase 18 Stage A Pre-Flight & Environment Readiness Check (Windows PowerShell)
.DESCRIPTION
    Detects OS, runner environment, tool versions, AWS caller identity, and required secret presence
    without printing or exposing secret values.
#>
$ErrorActionPreference = "Continue"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "CONVERSAIQ PHASE 18 — STAGING ENVIRONMENT READINESS CHECK" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$activeEnv = & "$scriptDir\Select-Environment.ps1"

Write-Host "`n--- 1. Tooling & Runtime Detection ---" -ForegroundColor Yellow
$tools = @(
    @{ Name = "Git"; Cmd = "git"; Args = "--version" },
    @{ Name = "Python"; Cmd = "python"; Args = "--version" },
    @{ Name = "Node.js"; Cmd = "node"; Args = "--version" },
    @{ Name = "npm"; Cmd = "npm"; Args = "--version" },
    @{ Name = "Docker"; Cmd = "docker"; Args = "--version" },
    @{ Name = "AWS CLI"; Cmd = "aws"; Args = "--version" },
    @{ Name = "Terraform"; Cmd = "terraform"; Args = "--version" }
)

$missingTools = @()
foreach ($t in $tools) {
    $cmdPath = Get-Command $t.Cmd -ErrorAction SilentlyContinue
    if ($cmdPath) {
        $ver = & $t.Cmd $t.Args 2>&1 | Select-Object -First 1
        Write-Host "[PASS] $($t.Name): $ver" -ForegroundColor Green
    } else {
        Write-Host "[MISSING] $($t.Name): Not found on PATH" -ForegroundColor Red
        $missingTools += $t.Name
    }
}

Write-Host "`n--- 2. AWS Identity & Permissions Check ---" -ForegroundColor Yellow
if (Get-Command "aws" -ErrorAction SilentlyContinue) {
    $identity = aws sts get-caller-identity 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[PASS] AWS STS Caller Identity verified." -ForegroundColor Green
    } else {
        Write-Host "[BLOCKED] AWS credentials not configured or expired." -ForegroundColor Red
    }
} else {
    Write-Host "[BLOCKED] AWS CLI unavailable; cannot verify aws sts get-caller-identity." -ForegroundColor Red
}

Write-Host "`n--- 3. Required Secrets & Environment Variables (Values Redacted) ---" -ForegroundColor Yellow
$requiredVars = @(
    "ENVIRONMENT",
    "DATABASE_URL",
    "REDIS_URL",
    "SECRET_KEY",
    "S3_BUCKET_NAME",
    "GEMINI_API_KEY",
    "ACM_CERTIFICATE_ARN",
    "STAGING_DOMAIN"
)
$unsetVars = @()
foreach ($v in $requiredVars) {
    $val = [Environment]::GetEnvironmentVariable($v)
    if (-not [string]::IsNullOrWhiteSpace($val)) {
        Write-Host "[SET]   $v (length=$($val.Length))" -ForegroundColor Green
    } else {
        Write-Host "[UNSET] $v" -ForegroundColor Yellow
        $unsetVars += $v
    }
}

Write-Host "`n======================================================================" -ForegroundColor Cyan
if ($missingTools.Count -gt 0 -or $unsetVars.Count -gt 0) {
    Write-Host "SUMMARY: Missing Tools=$($missingTools.Count), Unset EnvVars=$($unsetVars.Count)" -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "SUMMARY: Environment is 100% ready for staging deployment." -ForegroundColor Green
    exit 0
}
