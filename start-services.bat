@echo off
echo Starting MyNotebookLM Services...

echo.
echo Starting Python PDF Parser Service...
start "PDF Parser" cmd /k "cd /d pdf-parser && uvicorn app:app --port 8001 --reload"

echo.
echo Waiting 3 seconds for PDF service to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Express Backend...
start "Backend" cmd /k "cd /d backend && npm run dev"

echo.
echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend...
start "Frontend" cmd /k "cd /d frontend && npm run dev"

echo.
echo All services started!
echo - PDF Parser: http://localhost:8001
echo - Backend API: http://localhost:4001  
echo - Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
