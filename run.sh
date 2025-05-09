#!/bin/bash

echo "NFT Certificate Platform Launcher"
echo "==============================="
echo ""
echo "This script will start both the backend and frontend servers."
echo ""

# Set up directories
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Create backend terminal
echo "1. Starting Backend Server..."
if command_exists gnome-terminal; then
  gnome-terminal -- bash -c "cd '$BACKEND_DIR' && python -m uvicorn main:app --reload; exec bash"
elif command_exists xterm; then
  xterm -e "cd '$BACKEND_DIR' && python -m uvicorn main:app --reload" &
elif command_exists konsole; then
  konsole --workdir '$BACKEND_DIR' -e "python -m uvicorn main:app --reload" &
elif command_exists terminal; then
  terminal -e "cd '$BACKEND_DIR' && python -m uvicorn main:app --reload" &
else
  echo "Starting backend in background..."
  cd "$BACKEND_DIR" && python -m uvicorn main:app --reload &
  BACKEND_PID=$!
  echo "Backend server started with PID: $BACKEND_PID"
  cd "$SCRIPT_DIR"
fi

# Wait a moment for the backend to start
sleep 3

# Create frontend terminal
echo ""
echo "2. Starting Frontend Server..."
if command_exists gnome-terminal; then
  gnome-terminal -- bash -c "cd '$FRONTEND_DIR' && npm start; exec bash"
elif command_exists xterm; then
  xterm -e "cd '$FRONTEND_DIR' && npm start" &
elif command_exists konsole; then
  konsole --workdir '$FRONTEND_DIR' -e "npm start" &
elif command_exists terminal; then
  terminal -e "cd '$FRONTEND_DIR' && npm start" &
else
  echo "Starting frontend in background..."
  cd "$FRONTEND_DIR" && npm start &
  FRONTEND_PID=$!
  echo "Frontend server started with PID: $FRONTEND_PID"
  cd "$SCRIPT_DIR"
fi

echo ""
echo "3. Setup Complete!"
echo ""
echo "- Backend: http://localhost:8000"
echo "- Frontend: http://localhost:3000"
echo ""
echo "To stop the servers, close the terminal windows or use Ctrl+C if running in the background."
echo ""

if [[ -n ${BACKEND_PID+x} && -n ${FRONTEND_PID+x} ]]; then
  echo "If you want to stop the servers later, run: kill $BACKEND_PID $FRONTEND_PID"
  # Keep script running so user can ctrl+c to kill everything
  echo "Press Ctrl+C to stop all servers..."
  wait
fi 