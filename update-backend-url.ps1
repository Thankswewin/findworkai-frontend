# PowerShell script to update backend URL after deployment
# Run this after your backend is deployed on Render

param(
    [Parameter(Mandatory=$true)]
    [string]$BackendUrl
)

Write-Host "Updating frontend with backend URL: $BackendUrl" -ForegroundColor Green

# Remove old API URL
Write-Host "Removing old API URL..." -ForegroundColor Yellow
npx vercel env rm NEXT_PUBLIC_API_URL production --yes

# Add new API URL
Write-Host "Adding new API URL..." -ForegroundColor Yellow
echo "$BackendUrl/api/v1" | npx vercel env add NEXT_PUBLIC_API_URL production

# Also update for preview and development
echo "$BackendUrl/api/v1" | npx vercel env add NEXT_PUBLIC_API_URL preview
echo "$BackendUrl/api/v1" | npx vercel env add NEXT_PUBLIC_API_URL development

# Redeploy frontend
Write-Host "Redeploying frontend..." -ForegroundColor Yellow
npx vercel --prod

Write-Host "✅ Frontend updated successfully!" -ForegroundColor Green
Write-Host "Your app should now be fully functional at: https://frontend-lieq8816o-pheelymons-projects.vercel.app" -ForegroundColor Cyan
