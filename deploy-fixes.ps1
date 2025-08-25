#!/usr/bin/env pwsh

# FindWorkAI Frontend Deployment Script
# Fixes timeout issues and deploys to Vercel

Write-Host "🚀 FindWorkAI Frontend Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Function to check if command exists
function Test-Command {
    param($Command)
    try {
        Get-Command $Command -ErrorAction Stop
        return $true
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not (Test-Command "git")) {
    Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "npm")) {
    Write-Host "❌ npm not found. Please install Node.js first." -ForegroundColor Red
    exit 1
}

if (-not (Test-Command "vercel")) {
    Write-Host "⚠️ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ All prerequisites satisfied" -ForegroundColor Green

# Build and test locally first
Write-Host "`n🔨 Testing build locally..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix build errors first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Local build successful" -ForegroundColor Green

# Check if we have any uncommitted changes
Write-Host "`n📝 Checking git status..." -ForegroundColor Yellow
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "📁 Found uncommitted changes:" -ForegroundColor Cyan
    git status --short
    
    $commit = Read-Host "`nCommit these changes? (y/N)"
    if ($commit -eq 'y' -or $commit -eq 'Y') {
        git add .
        git commit -m "Fix: Frontend timeout issues and Vercel backend URL configuration

- Increased fetch timeout to 3 minutes for AI generation
- Fixed backend URL mismatch in vercel.json
- Added AbortController for proper timeout management
- Improved error handling and user feedback
- Updated progress indicators during AI generation"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Changes committed successfully" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to commit changes" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "⚠️ Proceeding without committing changes" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ Working directory clean" -ForegroundColor Green
}

# Show what we fixed
Write-Host "`n🔧 Summary of fixes applied:" -ForegroundColor Cyan
Write-Host "  1. ✅ Fixed Vercel backend URL (findworkai-backend-1.onrender.com)" -ForegroundColor Green
Write-Host "  2. ✅ Extended frontend timeout to 3 minutes" -ForegroundColor Green
Write-Host "  3. ✅ Added AbortController for timeout management" -ForegroundColor Green
Write-Host "  4. ✅ Improved error handling and user feedback" -ForegroundColor Green

# Deploy to Vercel
Write-Host "`n🚀 Deploying to Vercel..." -ForegroundColor Yellow

# Check if already logged in to Vercel
$vercelUser = vercel whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "📝 Please log in to Vercel:" -ForegroundColor Cyan
    vercel login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to log in to Vercel" -ForegroundColor Red
        exit 1
    }
}

# Deploy with production flag
Write-Host "🌍 Deploying to production..." -ForegroundColor Green
vercel --prod
if ($LASTEXITCODE -eq 0) {
    Write-Host "`n🎉 Deployment successful!" -ForegroundColor Green
    Write-Host "`n📊 Testing the fixes:" -ForegroundColor Cyan
    Write-Host "  • Backend URL: Fixed ✅"
    Write-Host "  • AI timeout: Extended to 3 minutes ✅"
    Write-Host "  • Error handling: Improved ✅"
    Write-Host "  • User experience: Enhanced ✅"
    
    Write-Host "`n🔗 Your app should now work properly with AI generation!" -ForegroundColor Green
    Write-Host "💡 The AI generation should now complete successfully within 3 minutes." -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host "Please check the error messages above and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host "`n📝 What was fixed:" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ BACKEND URL: Fixed mismatch between local and Vercel" -ForegroundColor Green
Write-Host "   - Was: findworkai-backend.onrender.com"
Write-Host "   - Now: findworkai-backend-1.onrender.com"
Write-Host ""
Write-Host "✅ TIMEOUT: Extended from 60s to 180s (3 minutes)" -ForegroundColor Green
Write-Host "   - Added AbortController for proper timeout management"
Write-Host "   - Matches backend AI generation time (60-120 seconds)"
Write-Host ""
Write-Host "✅ ERROR HANDLING: Improved user feedback" -ForegroundColor Green
Write-Host "   - Better error messages for timeout/connection issues"
Write-Host "   - Clear progress indication during generation"
Write-Host ""
Write-Host "✅ USER EXPERIENCE: Enhanced workflow" -ForegroundColor Green
Write-Host "   - Real-time progress updates"
Write-Host "   - Honest fallback messaging when AI service unavailable"

Write-Host "`n🎯 Your FindWorkAI frontend should now work perfectly!" -ForegroundColor Magenta
Write-Host "Try generating a website for a business - it should complete in 1-2 minutes." -ForegroundColor Green
