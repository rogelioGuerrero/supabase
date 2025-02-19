# API Endpoint Testing Script

# Configuration
$BaseUrl = "http://localhost:3000"
$ApiKey = "test_api_key_2024"

# Function to make API calls
function Invoke-ApiCall {
    [CmdletBinding()]
    param (
        [Parameter(Mandatory=$true)]
        [string]$Method,
        
        [Parameter(Mandatory=$true)]
        [string]$Endpoint,
        
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )

    $Headers['x-api-key'] = $ApiKey
    $Headers['Content-Type'] = 'application/json'

    $params = @{
        Method = $Method
        Uri = "$BaseUrl$Endpoint"
        Headers = $Headers
    }

    if ($Body) {
        $params['Body'] = $Body
    }

    try {
        Write-Host "Sending $Method request to $Endpoint" -ForegroundColor Cyan
        $response = Invoke-RestMethod @params
        Write-Host "Request successful!" -ForegroundColor Green
        return $response
    }
    catch {
        $statusCode = $_.Exception.Response.StatusCode.value__
        $errorMessage = $_.Exception.Message

        Write-Host "Error in $Method $Endpoint" -ForegroundColor Red
        Write-Host "Status Code: $statusCode" -ForegroundColor Yellow
        Write-Host "Error Message: $errorMessage" -ForegroundColor Yellow

        return $null
    }
}

# Function to handle errors
function Handle-Error {
    param($ErrorRecord)
    Write-Host "Error: $($ErrorRecord.Exception.Message)"
    Write-Host "Error details: $($ErrorRecord.ScriptStackTrace)"
}

# Function to test if server is available
function Test-ServerAvailable {
    param(
        [string]$Url,
        [int]$MaxAttempts = 10,
        [int]$DelaySeconds = 2
    )

    $attempts = 0
    while ($attempts -lt $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri $Url -Method Get -TimeoutSec 5
            if ($response.StatusCode -eq 200) {
                return $true
            }
        } catch {
            Write-Host "Waiting for server to start... Attempt $($attempts + 1)"
            Start-Sleep -Seconds $DelaySeconds
        }
        $attempts++
    }
    return $false
}

# Start server in background
Write-Host "Starting server..."
Start-Process npm -ArgumentList "run", "dev" -PassThru

# Wait for server to be available
$serverReady = Test-ServerAvailable -Url "$BaseUrl/health"
if (-not $serverReady) {
    Write-Host "Error: Server could not start" -ForegroundColor Red
    exit 1
}

Write-Host "API Endpoint Test Suite`n"

# Test Scenarios
Write-Host "API Endpoint Test Suite" -ForegroundColor Magenta

# 1. Health Check
Write-Host "`nHealth Check" -ForegroundColor Green
try {
    $healthCheck = Invoke-RestMethod -Uri "$BaseUrl/health"
    $healthCheck | ConvertTo-Json
} catch {
    Handle-Error $_
}

# 2. Supabase Connection Test
Write-Host "`nSupabase Connection Test" -ForegroundColor Green
try {
    $connectionTest = Invoke-RestMethod -Uri "$BaseUrl/test-connection"
    $connectionTest | ConvertTo-Json
} catch {
    Handle-Error $_
}

# 3. Get Productos (with API Key)
Write-Host "`nGet Productos" -ForegroundColor Green
$productos = Invoke-ApiCall -Method Get -Endpoint "/productos" -Headers @{
    "x-api-key" = $ApiKey
}
if ($productos) {
    $productos | ConvertTo-Json
}

# 4. Unauthorized Access Test
Write-Host "`nUnauthorized Access Test" -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BaseUrl/productos" -Method Get -ErrorAction Stop
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Unauthorized Access Test: $statusCode" -ForegroundColor Yellow
}

Write-Host "`nAPI Testing Complete" -ForegroundColor Magenta
