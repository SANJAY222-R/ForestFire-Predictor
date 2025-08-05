@echo off
echo ========================================
echo Forest Fire Predictor - Startup Script
echo ========================================
echo.

echo [1/5] Checking Node.js version...
node --version
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo [2/5] Checking npm version...
npm --version
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo.
echo [3/5] Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [4/5] Clearing Expo cache...
npx expo start --clear --tunnel
if %errorlevel% neq 0 (
    echo ERROR: Failed to start Expo
    pause
    exit /b 1
)

echo.
echo [5/5] Starting development server...
echo.
echo If you see any errors above, please:
echo 1. Check your internet connection
echo 2. Make sure all dependencies are installed
echo 3. Check the troubleshooting guide
echo.
pause 