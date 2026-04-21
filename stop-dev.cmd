@echo off
setlocal EnableExtensions

call :kill_port 3001 "Backend"
call :kill_port 5173 "Frontend"

echo Done.
exit /b 0

:kill_port
set "PORT=%~1"
set "LABEL=%~2"
set "PID="

for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":%PORT% .*LISTENING"') do (
  set "PID=%%P"
  goto :kill_found
)

echo [%LABEL%] Port %PORT% is not listening.
exit /b 0

:kill_found
echo [%LABEL%] Stopping PID %PID% on port %PORT% ...
taskkill /PID %PID% /F >nul 2>nul
if errorlevel 1 (
  echo [%LABEL%] Failed to stop PID %PID%.
) else (
  echo [%LABEL%] Stopped.
)
exit /b 0
