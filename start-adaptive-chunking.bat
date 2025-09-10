@echo off
echo Starting Adaptive PDF Chunking Services...
echo.

echo 1. Starting Python PDF Service on port 8001...
start "PDF Service" cmd /k "cd pdf-parser && python -m uvicorn app:app --port 8001 --reload"

timeout /t 3 /nobreak >nul

echo 2. Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

timeout /t 3 /nobreak >nul

echo 3. Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All services started! 
echo - PDF Service: http://localhost:8001
echo - Backend: http://localhost:4001  
echo - Frontend: http://localhost:5173
echo.
echo Upload a PDF to test adaptive chunking.
echo Watch the console logs for processing details.
pause
