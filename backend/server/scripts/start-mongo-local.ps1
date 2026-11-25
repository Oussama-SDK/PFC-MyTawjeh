$ErrorActionPreference = "Stop"

$serverRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$mongoRoot = Join-Path $serverRoot ".mongodb"
$dataPath = Join-Path $mongoRoot "data"
$logPath = Join-Path $mongoRoot "mongod.log"

New-Item -ItemType Directory -Force -Path $dataPath | Out-Null

$mongod = "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe"
if (-not (Test-Path -LiteralPath $mongod)) {
  $cmd = Get-Command mongod -ErrorAction SilentlyContinue
  if ($cmd) {
    $mongod = $cmd.Source
  } else {
    Write-Host "MongoDB executable not found. Install MongoDB Community Server or update this script path."
    exit 1
  }
}

Write-Host "Starting MongoDB on mongodb://127.0.0.1:27017"
Write-Host "Data: $dataPath"
Write-Host "Log:  $logPath"
Write-Host ""
Write-Host "Keep this terminal open while the backend is running."

& $mongod --dbpath $dataPath --logpath $logPath --bind_ip 127.0.0.1 --port 27017
