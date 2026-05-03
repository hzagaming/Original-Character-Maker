# OCM 一键启动（前后端同时启动）
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "OCM 一键启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 检查后端是否已在运行
try {
    $r = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 2 -UseBasicParsing
    Write-Host "[OK] 后端已在运行" -ForegroundColor Green
    $backendRunning = $true
} catch {
    Write-Host "[INFO] 后端未运行，准备启动..." -ForegroundColor Yellow
    $backendRunning = $false
}

# 启动后端
if (-not $backendRunning) {
    Write-Host "[1/2] 启动后端 (localhost:3001)..." -ForegroundColor Yellow
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit","-Command","cd '$root/server'; node src/index.js"
    Write-Host "      后端窗口已弹出，请保持打开" -ForegroundColor Green

    # 等待后端启动
    $retries = 0
    while ($retries -lt 10) {
        Start-Sleep -Seconds 1
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 2 -UseBasicParsing
            Write-Host "[OK] 后端启动成功" -ForegroundColor Green
            break
        } catch {
            $retries++
            if ($retries -eq 10) {
                Write-Host "[ERROR] 后端启动失败，请检查弹出的后端窗口" -ForegroundColor Red
                Read-Host "按 Enter 退出"
                exit 1
            }
        }
    }
}

# 启动前端
Write-Host "[2/2] 启动前端 (localhost:5173)..." -ForegroundColor Yellow
npm run dev
