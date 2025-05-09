@echo off
echo Starting NFT Certificate Platform Backend...
cd %~dp0..\backend
python -m uvicorn main:app --reload 