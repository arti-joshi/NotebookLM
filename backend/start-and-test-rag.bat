@echo off
echo Building TypeScript...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo Starting server...
start "Backend Server" cmd /k "npm start"

echo Waiting for server to start...
timeout /t 5 /nobreak

echo Testing RAG fixes...
node test-rag-fix.js

pause
