param(
  [string]$Output = "ocmaker-zeabur-source.zip"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$stage = Join-Path $root "tmp\zeabur-source"
$outputPath = Join-Path $root $Output

if (Test-Path $stage) {
  Remove-Item -LiteralPath $stage -Recurse -Force
}
New-Item -ItemType Directory -Force -Path $stage | Out-Null

if (Test-Path $outputPath) {
  Remove-Item -LiteralPath $outputPath -Force
}

$rootFiles = @(
  ".dockerignore",
  ".gitignore",
  "DEPLOY.md",
  "Dockerfile",
  "LICENSE",
  "index.html",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.node.json",
  "vite.config.ts"
)

foreach ($file in $rootFiles) {
  $src = Join-Path $root $file
  if (Test-Path $src) {
    Copy-Item -LiteralPath $src -Destination (Join-Path $stage $file) -Force
  }
}

$dirs = @(
  "prompts",
  "src",
  "server\src"
)

foreach ($dir in $dirs) {
  $src = Join-Path $root $dir
  $dst = Join-Path $stage $dir
  if (Test-Path $src) {
    New-Item -ItemType Directory -Force -Path (Split-Path $dst -Parent) | Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Recurse -Force
  }
}

$serverFiles = @(
  "server\package.json",
  "server\package-lock.json",
  "server\README.md"
)

foreach ($file in $serverFiles) {
  $src = Join-Path $root $file
  $dst = Join-Path $stage $file
  if (Test-Path $src) {
    New-Item -ItemType Directory -Force -Path (Split-Path $dst -Parent) | Out-Null
    Copy-Item -LiteralPath $src -Destination $dst -Force
  }
}

Push-Location $stage
try {
  $items = Get-ChildItem -Force | Select-Object -ExpandProperty Name
  Compress-Archive -Path $items -DestinationPath $outputPath -CompressionLevel Optimal
} finally {
  Pop-Location
}

$zip = Get-Item $outputPath
Write-Host "Created $($zip.FullName)"
Write-Host "Size: $([Math]::Round($zip.Length / 1KB, 1)) KB"
Write-Host "Upload this zip to Zeabur. Do not upload the whole project folder."
