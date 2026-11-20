# Setup Script for New Team Members
# Run this after getting the project

Write-Host "🚀 Setting up Decide Together project..." -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📋 Checking requirements..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "   Please install from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✅ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🗄️  Creating database and test data..." -ForegroundColor Yellow
node backend/seedReports.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Database created with 30 fake reports" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📝 Default Login Credentials:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   👨‍💼 Admin:" -ForegroundColor White
Write-Host "      Email: admin@decidetogether.com" -ForegroundColor Cyan
Write-Host "      Password: admin123" -ForegroundColor Cyan
Write-Host ""
Write-Host "   👤 User:" -ForegroundColor White
Write-Host "      Email: user@test.com" -ForegroundColor Cyan
Write-Host "      Password: user123" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 To start the server, run:" -ForegroundColor Yellow
Write-Host "   node backend/server.js" -ForegroundColor Cyan
Write-Host ""
Write-Host "🌐 Then open your browser to:" -ForegroundColor Yellow
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
