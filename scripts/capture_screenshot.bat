@echo off
echo NFT Certificate Platform - Screenshot Helper
echo =========================================
echo.
echo This script will help you create a screenshot for the README.
echo.
echo Steps:
echo 1. The application will start in a moment.
echo 2. Navigate to the main interface or the most visually appealing screen.
echo 3. Use Windows Snipping Tool (Win+Shift+S) to capture the screenshot.
echo 4. Save the captured image as "screenshot.png" in frontend/public folder.
echo.
echo Press any key to start the application...
pause > nul

echo Starting the application...
cd %~dp0..
start run.bat

echo.
echo Application is starting...
echo.
echo When ready, capture your screenshot and save it as:
echo %~dp0..\frontend\public\screenshot.png
echo.
echo Press any key to exit this helper...
pause > nul 