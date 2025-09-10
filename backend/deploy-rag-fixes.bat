@echo off
echo 🔧 Deploying Enhanced RAG System...
echo.

echo Step 1: Building TypeScript...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Check TypeScript errors above.
    pause
    exit /b 1
)
echo ✅ Build successful!
echo.

echo Step 2: Starting server with enhanced RAG...
echo 📝 The server will start in a new window
echo 💡 After server starts, test with: "who is Aryabhata"
echo.
start "Enhanced RAG Server" cmd /k "npm start"

echo Step 3: Waiting for server to initialize...
timeout /t 8 /nobreak > nul

echo 🧪 Testing the enhanced RAG system...
node debug-aryabhata-specific.js

echo.
echo 🎯 Next steps:
echo 1. Go to your chat interface
echo 2. Ask: "who is Aryabhata" 
echo 3. Check server logs for: [RAG-Enhanced] Retrieved chunks
echo 4. You should now see the Aryabhata information!
echo.
pause
