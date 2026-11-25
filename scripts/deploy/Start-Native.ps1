<#
.SYNOPSIS
    Start ConversaIQ Native Production Processes (Uvicorn + Production Static Frontend)
.DESCRIPTION
    Starts FastAPI backend using Uvicorn (no --reload) and serves production frontend/dist
    via serve_frontend.mjs. Writes PIDs to .run/ for clean lifecycle management.
#>
param(
    [int]$BackendPort = 8000,
    [int]$FrontendPort = 4173,
    [string]$DatabaseUrl = $env:DATABASE_URL
)

$ErrorActionPreference = "Stop"
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = Resolve-Path "$scriptDir\..\.."
$runDir = "$repoRoot\.run"

if (-not (Test-Path $runDir)) {
    New-Item -ItemType Directory -Path $runDir | Out-Null
}

if (-not (Test-Path "$repoRoot\frontend\dist\index.html")) {
    Write-Error "frontend/dist/index.html not found. Run .\scripts\deploy\Deploy-Native.ps1 first."
}

# Set default local SQLite if no DATABASE_URL provided for local smoke startup
if ([string]::IsNullOrWhiteSpace($DatabaseUrl)) {
    $env:DATABASE_URL = "sqlite+aiosqlite:///$($repoRoot -replace '\\','/')/.run/native_local.db"
    Write-Warning "No DATABASE_URL set; using isolated local SQLite for native smoke startup."
} else {
    $env:DATABASE_URL = $DatabaseUrl
}

# Ensure .venv site-packages are appended to sys.path (AppLocker-safe, matches conftest.py)
$venvSite = "$repoRoot\backend\.venv\Lib\site-packages"
$env:PYTHONPATH = "$repoRoot\backend"

# Start Backend (Uvicorn production ASGI, no --reload)
Write-Host "Starting ConversaIQ Backend (Uvicorn) on http://127.0.0.1:$BackendPort ..." -ForegroundColor Yellow
$uvicornCmd = "import sys; sys.path.append(r'$venvSite'); import uvicorn; uvicorn.run('app.main:app', host='127.0.0.1', port=$BackendPort)"
$backendProc = Start-Process -FilePath "python" `
    -ArgumentList "-c", "`"$uvicornCmd`"" `
    -WorkingDirectory "$repoRoot\backend" `
    -RedirectStandardOutput "$runDir\backend.out.log" `
    -RedirectStandardError "$runDir\backend.err.log" `
    -PassThru -WindowStyle Hidden

$backendProc.Id | Out-File -FilePath "$runDir\backend.pid" -Encoding ascii
Write-Host "[OK] Backend PID: $($backendProc.Id)" -ForegroundColor Green

# Start Production Frontend Static Server
Write-Host "Starting ConversaIQ Production Frontend on http://127.0.0.1:$FrontendPort ..." -ForegroundColor Yellow
$env:FRONTEND_PORT = "$FrontendPort"
$frontendProc = Start-Process -FilePath "node" `
    -ArgumentList "$scriptDir\serve_frontend.mjs" `
    -WorkingDirectory "$repoRoot" `
    -RedirectStandardOutput "$runDir\frontend.out.log" `
    -RedirectStandardError "$runDir\frontend.err.log" `
    -PassThru -WindowStyle Hidden

$frontendProc.Id | Out-File -FilePath "$runDir\frontend.pid" -Encoding ascii
Write-Host "[OK] Frontend PID: $($frontendProc.Id)" -ForegroundColor Green
