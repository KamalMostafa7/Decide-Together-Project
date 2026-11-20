# Clean Project for Sharing
# Run this before creating ZIP file or uploading to GitHub

Write-Host "🧹 Cleaning project for sharing..." -ForegroundColor Cyan

# Remove node_modules (can be reinstalled with npm install)
if (Test-Path "node_modules") {
    Write-Host "❌ Removing node_modules folder..." -ForegroundColor Yellow
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "✅ node_modules removed" -ForegroundColor Green
} else {
    Write-Host "✅ node_modules already removed" -ForegroundColor Green
}

# Remove database (will be recreated with seed script)
if (Test-Path "database.db") {
    Write-Host "❌ Removing database.db..." -ForegroundColor Yellow
    Remove-Item -Path "database.db" -Force
    Write-Host "✅ database.db removed" -ForegroundColor Green
} else {
    Write-Host "✅ database.db already removed" -ForegroundColor Green
}

# Remove package-lock.json (optional, will be recreated)
if (Test-Path "package-lock.json") {
    Write-Host "❌ Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "✅ package-lock.json removed" -ForegroundColor Green
}

Write-Host ""
Write-Host "✨ Project is clean and ready to share!" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Project size: " -NoNewline
$size = (Get-ChildItem -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ("{0:N2} MB" -f $size) -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Create ZIP file of the project folder" -ForegroundColor White
Write-Host "2. OR push to GitHub" -ForegroundColor White
Write-Host "3. Share COLLABORATION_GUIDE.md with your teammate" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember to run 'npm install' when you need to work again!" -ForegroundColor Red
