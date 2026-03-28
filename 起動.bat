@echo off
title SerendipityLab
cd /d "%~dp0"
echo.
echo  SerendipityLab を起動しています...
echo  http://localhost:3000 をブラウザで開いてください
echo.
start "" "http://localhost:3000"
npm run dev
pause
