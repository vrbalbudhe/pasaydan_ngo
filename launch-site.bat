@echo off
chcp 65001 >nul
echo ==========================================
echo    PASAYDAN NGO - Application Launcher
echo ==========================================
echo.

echo Starting application setup...
cd /d "C:\Users\pasay\Desktop\Pasaydan\pasaydan_ngo"

if not exist "package.json" (
    echo ❌ Error: Project directory not found or invalid!
    echo Please check if the path is correct: %CD%
    pause
    exit /b 1
)

echo ✅ Changed to project directory: %CD%
echo.

echo 📥 Pulling latest code from GitHub...
git pull origin main
if errorlevel 1 (
    echo ⚠️  Warning: Git pull failed, continuing anyway...
    echo This might happen if you have local changes or network issues.
)
echo.

echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error: npm install failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)
echo.

echo 🔧 Ensuring Prisma client is generated...
call npx prisma generate
if errorlevel 1 (
    echo ❌ Error: Prisma generate failed!
    echo Please check your database configuration.
    pause
    exit /b 1
)
echo.

echo 🗄️  Pushing database schema...
call npx prisma db push
if errorlevel 1 (
    echo ❌ Error: Prisma db push failed!
    echo Please check your database connection and schema.
    pause
    exit /b 1
)
echo.

echo ✅ Database setup complete!
echo.

echo 🚀 Starting Next.js server and launching browser...
echo ⏳ Note: First compilation may take 30-60 seconds...
echo 📝 Check the console for any compilation errors...
echo.

REM Kill any existing Node processes on port 3000 (optional cleanup)
echo 🧹 Cleaning up any existing processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3000" ^| find "LISTENING"') do (
    echo Killing process %%a on port 3000...
    taskkill /f /pid %%a >nul 2>&1
)

echo 🌐 Launching application...
node launch.js

echo.
echo 🛑 Application stopped. Press any key to exit...
pause >nul