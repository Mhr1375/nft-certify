# PowerShell script for NFT Certificate Platform
Write-Host "NFT Certificate Platform Launcher (PowerShell)" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "This script will start both the backend and frontend servers." -ForegroundColor Cyan
Write-Host ""

# Get the directory of the script
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent $ScriptDir

# Start backend
Write-Host "1. Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootDir\backend'; python -m uvicorn main:app --reload"
Start-Sleep -Seconds 3

# Start frontend
Write-Host "2. Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$RootDir\frontend'; npm start"

Write-Host ""
Write-Host "3. Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "- Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "- Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "NOTE: The server windows will remain open. Close them when you're done." -ForegroundColor Yellow 