# Script chay nhanh frontend tren Windows (PowerShell)
#   .\run.ps1            -> chay dev server (http://localhost:5173)
#   .\run.ps1 build      -> build production (thu muc dist)
#   .\run.ps1 preview    -> xem thu ban build

$ErrorActionPreference = 'Stop'
$nodeDir = 'C:\Program Files\nodejs'
if (Test-Path $nodeDir) { $env:Path = "$nodeDir;$env:Path" }

if (-not (Test-Path (Join-Path $PSScriptRoot 'node_modules'))) {
  Write-Host 'Chua cai dependencies, dang chay npm install...' -ForegroundColor Cyan
  & npm install --no-fund --no-audit
}

$cmd = if ($args.Count -gt 0) { $args[0] } else { 'dev' }
switch ($cmd) {
  'build'   { & npm run build }
  'preview' { & npm run preview }
  default   { & npm run dev }
}
