<#
.SYNOPSIS
    ConversaIQ Deployment Environment Selector
.DESCRIPTION
    Selects and validates the active deployment runner environment:
    WINDOWS_LOCAL (default), GITHUB_ACTIONS, or AWS_CLOUDSHELL.
    Explicitly reports any environment switch.
#>
param(
    [ValidateSet("WINDOWS_LOCAL", "GITHUB_ACTIONS", "AWS_CLOUDSHELL")]
    [string]$Environment = $env:CONVERSAIQ_DEPLOY_ENV
)

if ([string]::IsNullOrWhiteSpace($Environment)) {
    if ($env:GITHUB_ACTIONS -eq "true") {
        $Environment = "GITHUB_ACTIONS"
    } elseif ($env:AWS_EXECUTION_ENV -like "*CloudShell*") {
        $Environment = "AWS_CLOUDSHELL"
    } else {
        $Environment = "WINDOWS_LOCAL"
    }
}

$previous = $env:CONVERSAIQ_DEPLOY_ENV
if ($previous -and $previous -ne $Environment) {
    Write-Warning "Environment switched from '$previous' to '$Environment'."
}

$env:CONVERSAIQ_DEPLOY_ENV = $Environment
Write-Host "Active ConversaIQ Deployment Environment: $Environment" -ForegroundColor Cyan

return $Environment
