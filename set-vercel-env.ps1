# PowerShell script to set Vercel environment variables
# Run this script to add all environment variables to your Vercel project

Write-Host "Setting up Vercel environment variables..." -ForegroundColor Green

# Set environment variables for all environments (Production, Preview, Development)
$envVars = @{
    "NEXT_PUBLIC_SUPABASE_URL" = "https://iisbjsfjuuxenkkjvpli.supabase.co"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlpc2Jqc2ZqdXV4ZW5ra2p2cGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTEzNTcsImV4cCI6MjA3MDM4NzM1N30.qFyZk30uXviMs_4N6QhzFmlIPtpK_cM9jpr2bbTsrJY"
    "NEXT_PUBLIC_API_URL" = "https://findworkai-backend.up.railway.app/api/v1"
    "NEXT_PUBLIC_GOOGLE_MAPS_KEY" = "AIzaSyBDboXp5ngpi0uCGXE-hObxbbQGdC1JT8I"
    "NEXT_PUBLIC_OPENROUTER_API_KEY" = "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"
    "NEXT_PUBLIC_AI_MODEL" = "anthropic/claude-3-haiku"
    "NEXT_PUBLIC_APP_NAME" = "FindWorkAI"
    "NEXT_PUBLIC_APP_VERSION" = "1.0.0"
    "NEXTAUTH_SECRET" = "your-secret-key-change-this-in-production-dev-only-12345678"
    "NEXTAUTH_URL" = "https://frontend-c5fc8ozjr-pheelymons-projects.vercel.app"
}

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    Write-Host "Adding $key..." -ForegroundColor Yellow
    
    # Add to production
    echo $value | npx vercel env add $key production
    
    # Add to preview
    echo $value | npx vercel env add $key preview
    
    # Add to development
    echo $value | npx vercel env add $key development
}

Write-Host "Environment variables set successfully!" -ForegroundColor Green
Write-Host "Now run: npx vercel --prod" -ForegroundColor Cyan
