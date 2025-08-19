# Test API Connectivity Script
Write-Host "Testing FindWorkAI API Connectivity..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Backend URL
$backendUrl = "https://findworkai-backend-1.onrender.com"

# Test 1: Check if backend is alive
Write-Host "`nTest 1: Checking backend health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/health" -Method GET -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Backend is alive and responding!" -ForegroundColor Green
    }
} catch {
    Write-Host "✗ Backend health check failed: $_" -ForegroundColor Red
}

# Test 2: Test search endpoint
Write-Host "`nTest 2: Testing search endpoint..." -ForegroundColor Yellow
$searchBody = @{
    query = "restaurant"
    location = "New York, NY"
    radius = 5000
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/v1/businesses/search" `
        -Method POST `
        -ContentType "application/json" `
        -Body $searchBody `
        -TimeoutSec 15
    
    $result = $response.Content | ConvertFrom-Json
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Search endpoint responded successfully!" -ForegroundColor Green
        Write-Host "  Found $($result.Count) businesses" -ForegroundColor Gray
        
        # Check if it's demo data
        if ($result.Count -gt 0 -and $result[0].name -like "*Demo*") {
            Write-Host "⚠ WARNING: Received demo data instead of real data!" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "✗ Search endpoint failed: $_" -ForegroundColor Red
    Write-Host "  Status Code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
}

# Test 3: Check API configuration
Write-Host "`nTest 3: Checking frontend environment..." -ForegroundColor Yellow
Write-Host "  Frontend URL: https://findworkai-frontend.vercel.app" -ForegroundColor Gray
Write-Host "  Expected API URL in frontend: $backendUrl" -ForegroundColor Gray

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test complete! Check the results above." -ForegroundColor Cyan
Write-Host "`nTo view real-time logs:" -ForegroundColor White
Write-Host "1. Open: https://findworkai-frontend.vercel.app/dashboard/search?debug=true" -ForegroundColor White
Write-Host "2. Look for the Debug button in the bottom-right corner" -ForegroundColor White
Write-Host "3. Click it to see API calls and errors" -ForegroundColor White
