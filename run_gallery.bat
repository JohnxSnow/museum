@echo off
title Grand Royal 3D Art Palace (56 Masterpieces)
color 0e
cls
echo ========================================================================
echo   🏛️  Grand Royal 3D Art Palace - 180m Imperial Virtual Museum
echo   🎨  56 Real World Masterpieces, Surrealism & Kurdish Heritage
echo ========================================================================
echo.
echo [1] Checking Node.js environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Node.js is not found in PATH. Please install Node.js from https://nodejs.org
    pause
    exit /b
)

echo [2] Opening Gallery in your default Web Browser...
start http://localhost:3000

echo [3] Starting HTTP Server (accessible on PC and Mobile)...
echo.
node server.js
pause

