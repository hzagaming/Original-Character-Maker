@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

set "ROOT=%~dp0"
cd /d "%ROOT%"

echo ==========================================
echo Original Character Maker - 一键启动脚本
echo ==========================================
echo.

:: 检查前端依赖
if not exist "node_modules" (
    echo [ERROR] 前端依赖缺失。请先在项目根目录执行：npm install
    pause
    exit /b 1
)

:: 检查后端依赖
if not exist "server\node_modules" (
    echo [ERROR] 后端依赖缺失。请先在 server 目录执行：npm install
    pause
    exit /b 1
)

:: 检查 .env
if not exist ".env" (
    echo [WARNING] 未找到 .env 文件。将从 .env.example 复制...
    copy .env.example .env
    echo [WARNING] 请编辑 .env 文件，填入 PLATO_API_KEY 等配置
    echo.
)

:: 检查后端端口是否被占用
for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3001 "') do (
    echo [WARNING] 3001 端口已被 PID %%P 占用。后端可能已在运行。
    goto :skip_backend
)

echo [1/3] 启动后端 (localhost:3001)...
cd /d "%ROOT%server"
start "OCM-Backend" cmd /k "node src/index.js"
echo [OK] 后端启动中...

timeout /t 3 /nobreak >nul

:skip_backend
cd /d "%ROOT%"

:: 检查后端是否成功启动
echo [2/3] 检查后端健康状态...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3001/api/health' -TimeoutSec 5; Write-Host ('[OK] 后端响应正常: ' + $r.Content) } catch { Write-Host '[ERROR] 后端未响应，请检查上面的后端窗口是否有报错' }"

echo.
echo [3/3] 启动前端 (localhost:5173)...
npm run dev

echo.
echo ==========================================
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3001
echo ==========================================
