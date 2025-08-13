# Breast Cancer Detection App Startup Script
Write-Host "🩺 Starting Breast Cancer Detection Application..." -ForegroundColor Green

# Check if Python is available
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python found" -ForegroundColor Green
} else {
    Write-Host "❌ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "✅ Node.js found" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Please install Node.js 14+" -ForegroundColor Red
    exit 1
}

Write-Host "`n🔧 Setting up Backend..." -ForegroundColor Yellow
Set-Location "backend"

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Cyan
pip install -r requirements.txt

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

# Start backend server in background
Write-Host "Starting Flask server..." -ForegroundColor Cyan
Start-Process python -ArgumentList "app.py" -NoNewWindow

Set-Location "../frontend"

Write-Host "`n🎨 Setting up Frontend..." -ForegroundColor Yellow

# Install Node.js dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Cyan
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 Starting Application..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the application`n" -ForegroundColor Yellow

# Start frontend server
npm start
