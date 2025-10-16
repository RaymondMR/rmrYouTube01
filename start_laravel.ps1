# ===============================================
# Laravel Project Startup Script
# Author: Ramon Ramirez
# Description: Starts Laravel backend + Vite frontend
# ===============================================

# Change to your Laravel project path
$projectPath =  Split-Path $MyInvocation.MyCommand.Path -Parent

# Move to project directory
Set-Location $projectPath

Write-Host "🚀 Starting Laravel project at $projectPath`n"

# 1️⃣ Check dependencies
if (!(Test-Path "$projectPath\vendor")) {
    Write-Host "📦 Installing PHP dependencies..."
    composer install
}

if (!(Test-Path "$projectPath\node_modules")) {
    Write-Host "📦 Installing Node dependencies..."
    npm install
}

# 2️⃣ Start Laravel backend in new window
Write-Host "🧠 Starting Laravel server..."
Start-Process powershell -ArgumentList "-Command", "Set-Location '$projectPath'; php artisan serve"

# 3️⃣ Start Vite frontend in another window
Write-Host "🎨 Starting Vite (npm run dev)..."
Start-Process powershell -ArgumentList "-Command", "Set-Location '$projectPath'; npm run dev"

Write-Host "`n✅ Laravel and Vite are running in separate windows!"
Write-Host "   → Backend: http://127.0.0.1:8000"
Write-Host "   → Frontend (Vite): http://localhost:5173"
