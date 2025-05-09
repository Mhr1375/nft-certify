@echo off
echo NFT Certificate Platform Launcher
echo ===============================
echo.
echo This script will start both the backend and frontend servers.
echo.
echo 1. Starting Backend Server...
start cmd /k "cd backend & python -m uvicorn main:app --reload"
timeout /t 3 > nul
echo.
echo 2. Starting Frontend Server...
start cmd /k "cd frontend & npm start"
echo.
echo 3. Setup Complete!
echo.
echo - Backend: http://localhost:8000
echo - Frontend: http://localhost:3000
echo.
echo Press any key to exit this launcher. The servers will continue running...
pause > nul 