#!/bin/bash

echo "NFT Certificate Platform - Screenshot Helper"
echo "========================================="
echo ""
echo "This script will help you create a screenshot for the README."
echo ""
echo "Steps:"
echo "1. The application will start in a moment."
echo "2. Navigate to the main interface or the most visually appealing screen."
echo "3. Use your system's screenshot tool to capture the screen:"
echo "   - macOS: Press Command+Shift+4 (for selection)"
echo "   - Linux: Use your distribution's screenshot tool (often PrintScreen key)"
echo "4. Save the captured image as \"screenshot.png\" in frontend/public folder."
echo ""
read -p "Press Enter to start the application..."

echo "Starting the application..."
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR/.."
chmod +x run.sh
./run.sh &

echo ""
echo "Application is starting..."
echo ""
echo "When ready, capture your screenshot and save it as:"
echo "$SCRIPT_DIR/../frontend/public/screenshot.png"
echo ""
read -p "Press Enter to exit this helper..." 