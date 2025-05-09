#!/bin/bash
echo "Starting NFT Certificate Platform Backend..."
cd "$(dirname "$0")/../backend" || exit
python -m uvicorn main:app --reload 