@echo off
echo Starting NFT Certificate Platform...
echo.
echo Starting Backend Server in a new window...
start cmd /k "cd %~dp0..\backend & python -m uvicorn main:app --reload"
echo.
echo Starting Frontend Server in a new window...
start cmd /k "cd %~dp0..\frontend & npm start"
echo.
echo Servers starting! The application will open in your browser shortly.
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo. 