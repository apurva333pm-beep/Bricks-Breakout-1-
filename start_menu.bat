@echo off
title Sonic Breakout Launcher
echo ==========================================
echo     SONIC BREAKOUT - Starting Menu...
echo ==========================================
echo.

cd /d "%~dp0"

:: Start the Python server in the background
start /B python launcher.py

:: Wait a moment for the server to start
timeout /t 2 /nobreak >nul

:: Open the menu page in the default browser
start http://localhost:8000

echo.
echo Menu is open in your browser!
echo Keep this window open while playing.
echo Press Ctrl+C to stop the server.
echo.

:: Keep the window alive
pause >nul
