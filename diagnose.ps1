# Original Character Maker - 诊断脚本
# 运行方式: 右键 -> 使用 PowerShell 运行
# 或在 PowerShell 中执行: .\diagnose.ps1

$ErrorActionPreference = "Continue"
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "OCM 诊断脚本" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Node.js 版本
Write-Host "[1/8] 检查 Node.js 版本..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "      Node.js: $nodeVersion" -ForegroundColor Green
    if ($nodeVersion -match "v(\d+)") {
        $major = [int]$Matches[1]
        if ($major -lt 18) {
            Write-Host "      [ERROR] Node.js 版本过低，需要 >= 18" -ForegroundColor Red
        }
    }
} else {
    Write-Host "      [ERROR] Node.js 未安装！请访问 https://nodejs.org 下载安装" -ForegroundColor Red
    exit 1
}

# 2. 前端依赖
Write-Host "[2/8] 检查前端依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "      [OK] node_modules 存在" -ForegroundColor Green
} else {
    Write-Host "      [ERROR] 前端依赖缺失。请在项目根目录执行: npm install" -ForegroundColor Red
}

# 3. 后端依赖
Write-Host "[3/8] 检查后端依赖..." -ForegroundColor Yellow
if (Test-Path "server\node_modules") {
    Write-Host "      [OK] server/node_modules 存在" -ForegroundColor Green
} else {
    Write-Host "      [ERROR] 后端依赖缺失。请在 server 目录执行: npm install" -ForegroundColor Red
}

# 4. .env 文件
Write-Host "[4/8] 检查 .env 配置..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "      [OK] .env 文件存在" -ForegroundColor Green
    $envContent = Get-Content .env -Raw
    if ($envContent -match "PLATO_API_KEY=([^\r\n]+)") {
        $key = $Matches[1].Trim()
        if ($key -and $key -ne "") {
            Write-Host "      [OK] PLATO_API_KEY 已配置" -ForegroundColor Green
        } else {
            Write-Host "      [WARNING] PLATO_API_KEY 为空。工作流会失败。" -ForegroundColor Yellow
        }
    } else {
        Write-Host "      [WARNING] .env 中未找到 PLATO_API_KEY" -ForegroundColor Yellow
    }
} else {
    Write-Host "      [ERROR] .env 文件不存在。请执行: copy .env.example .env" -ForegroundColor Red
}

# 5. 端口占用
Write-Host "[5/8] 检查端口占用..." -ForegroundColor Yellow
$port3001 = netstat -ano | Select-String ":3001 .*LISTENING"
$port5173 = netstat -ano | Select-String ":5173 .*LISTENING"
if ($port3001) {
    Write-Host "      [OK] 3001 端口被占用:" $port3001.ToString().Trim() -ForegroundColor Green
} else {
    Write-Host "      [ERROR] 3001 端口空闲 — 后端没有运行！" -ForegroundColor Red
}
if ($port5173) {
    Write-Host "      [OK] 5173 端口被占用:" $port5173.ToString().Trim() -ForegroundColor Green
} else {
    Write-Host "      [INFO] 5173 端口空闲 — 前端没有运行" -ForegroundColor Cyan
}

# 6. 后端健康检查
Write-Host "[6/8] 测试后端 /api/health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 5 -UseBasicParsing
    Write-Host "      [OK] 后端响应:" $response.Content -ForegroundColor Green
} catch {
    Write-Host "      [ERROR] 后端无响应:" $_.Exception.Message -ForegroundColor Red
}

# 7. 检查关键文件
Write-Host "[7/8] 检查关键文件..." -ForegroundColor Yellow
$files = @(
    "server\src\index.js",
    "server\src\app.js",
    "server\src\config.js",
    "src\apiConfig.ts",
    "vite.config.ts"
)
$allOk = $true
foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "      [OK] $file" -ForegroundColor Green
    } else {
        Write-Host "      [ERROR] 缺失: $file" -ForegroundColor Red
        $allOk = $false
    }
}

# 8. Git 状态
Write-Host "[8/8] 检查 Git 状态..." -ForegroundColor Yellow
$gitStatus = git status --short 2>$null
if ($LASTEXITCODE -eq 0) {
    if ($gitStatus) {
        Write-Host "      [INFO] 有未提交的修改:" -ForegroundColor Cyan
        $gitStatus | ForEach-Object { Write-Host "            $_" -ForegroundColor Cyan }
    } else {
        Write-Host "      [OK] 工作树干净" -ForegroundColor Green
    }
} else {
    Write-Host "      [WARNING] 不是 Git 仓库或 Git 未安装" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "诊断完成" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

if (-not $port3001) {
    Write-Host "后端没有运行！请执行以下命令启动:" -ForegroundColor Red
    Write-Host "    cd server" -ForegroundColor Yellow
    Write-Host "    node src/index.js" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "或者双击项目根目录的 start.cmd 一键启动" -ForegroundColor Yellow
} else {
    Write-Host "后端正在运行。请刷新浏览器再试。" -ForegroundColor Green
}

Write-Host ""
Read-Host "按 Enter 键退出"
