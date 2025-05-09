#!/bin/bash
echo "Starting NFT Certificate Platform..."
echo ""
echo "Starting backend server..."
ROOT_DIR="$(dirname "$0")/.."

# Detect terminal type and launch accordingly
if command -v gnome-terminal &>/dev/null; then
    gnome-terminal -- bash -c "cd $ROOT_DIR/backend && python -m uvicorn main:app --reload; exec bash"
    gnome-terminal -- bash -c "cd $ROOT_DIR/frontend && npm start; exec bash"
elif command -v terminal &>/dev/null; then # macOS
    terminal -e "cd $ROOT_DIR/backend && python -m uvicorn main:app --reload"
    terminal -e "cd $ROOT_DIR/frontend && npm start"
elif command -v xterm &>/dev/null; then
    xterm -e "cd $ROOT_DIR/backend && python -m uvicorn main:app --reload" &
    xterm -e "cd $ROOT_DIR/frontend && npm start" &
else
    # Fallback to running in background and instructing user
    echo "Could not detect terminal emulator. Starting servers in background..."
    echo ""
    cd "$ROOT_DIR/backend" || exit
    python -m uvicorn main:app --reload &
    BACKEND_PID=$!
    cd "$ROOT_DIR/frontend" || exit
    npm start &
    FRONTEND_PID=$!
    
    echo ""
    echo "Servers are starting in the background:"
    echo "Backend PID: $BACKEND_PID"
    echo "Frontend PID: $FRONTEND_PID"
    echo ""
    echo "To stop servers: kill $BACKEND_PID $FRONTEND_PID"
fi

echo ""
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000" 