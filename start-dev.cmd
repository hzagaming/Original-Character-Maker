@echo off
setlocal

set "ROOT=%~dp0"
cd /d "%ROOT%"

if not exist "%ROOT%node_modules" (
  echo [ERROR] Root dependencies are missing. Run "npm install" first.
  exit /b 1
)

if not exist "%ROOT%server\node_modules" (
  echo [ERROR] Server dependencies are missing. Run "cd server && npm install" first.
  exit /b 1
)

echo Starting backend on http://127.0.0.1:3001 ...
start "Original-Character-Maker Backend" cmd /k "cd /d ""%ROOT%server"" && npm run dev"

echo Starting frontend on http://127.0.0.1:5173 ...
start "Original-Character-Maker Frontend" cmd /k "cd /d ""%ROOT%"" && npm run dev -- --host 0.0.0.0"

echo.
echo Frontend: http://127.0.0.1:5173
echo Backend : http://127.0.0.1:3001
echo.
echo If Aliyun cutout is enabled, make sure .env contains:
echo   ALIBABA_CLOUD_ACCESS_KEY_ID
echo   ALIBABA_CLOUD_ACCESS_KEY_SECRET

exit /b 0
