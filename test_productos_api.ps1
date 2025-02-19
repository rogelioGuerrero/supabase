# Productos API Comprehensive Test Script

# Configuration
$BaseUrl = "http://localhost:3000"
$ApiKey = "test_api_key_2024"

# Function for API Calls
function Invoke-ProductoApiCall {
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

# Test Scenarios
Write-Host "Productos API Test Suite" -ForegroundColor Magenta

# 1. Create Producto
Write-Host "`nCREATE Producto Test" -ForegroundColor Green
$newProducto = @{
    nombre = "Test Producto"
    descripcion = "Producto creado para pruebas"
    precio = 99.99
    stock = 50
    categoria = "Pruebas"
} | ConvertTo-Json

$createdProducto = Invoke-ProductoApiCall -Method Post -Endpoint "/productos" -Body $newProducto
if ($createdProducto) {
    $createdProducto | ConvertTo-Json
}

# 2. Get All Productos
Write-Host "`nGET ALL Productos" -ForegroundColor Green
$allProductos = Invoke-ProductoApiCall -Method Get -Endpoint "/productos"
if ($allProductos) {
    $allProductos | ConvertTo-Json
}

# 3. Get Producto by ID (if created successfully)
if ($createdProducto -and $createdProducto.id) {
    Write-Host "`nGET Producto by ID" -ForegroundColor Green
    $productoById = Invoke-ProductoApiCall -Method Get -Endpoint "/productos/$($createdProducto.id)"
    if ($productoById) {
        $productoById | ConvertTo-Json
    }
}

# 4. Update Producto
if ($createdProducto -and $createdProducto.id) {
    Write-Host "`nUPDATE Producto" -ForegroundColor Green
    $updatedProducto = @{
        nombre = "Producto Actualizado"
        descripcion = "Producto modificado en pruebas"
        precio = 129.99
        stock = 25
        categoria = "Pruebas Actualizadas"
    } | ConvertTo-Json

    $updateResult = Invoke-ProductoApiCall -Method Put -Endpoint "/productos/$($createdProducto.id)" -Body $updatedProducto
    if ($updateResult) {
        $updateResult | ConvertTo-Json
    }
}

# 5. Delete Producto
if ($createdProducto -and $createdProducto.id) {
    Write-Host "`nDELETE Producto" -ForegroundColor Green
    $deleteResult = Invoke-ProductoApiCall -Method Delete -Endpoint "/productos/$($createdProducto.id)"
    if ($deleteResult) {
        $deleteResult | ConvertTo-Json
    }
}

# 6. Unauthorized Access Test
Write-Host "`nUnauthorized Access Test" -ForegroundColor Green
try {
    Invoke-RestMethod -Uri "$BaseUrl/productos" -Method Get -ErrorAction Stop
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "Unauthorized Access Test: $statusCode" -ForegroundColor Yellow
}

Write-Host "`nProductos API Testing Complete" -ForegroundColor Magenta
