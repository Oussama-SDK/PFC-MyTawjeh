# Auto-elevate to Administrator if needed (required to start Windows services)
if (-not ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Start-Process powershell -Verb RunAs -ArgumentList "-NoExit -File `"$($MyInvocation.MyCommand.Path)`""
    exit
}

$ErrorActionPreference = "Stop"

$SCRIPT_PATH = $MyInvocation.MyCommand.Path
$ROOT = Split-Path $SCRIPT_PATH -Parent
$BACKEND  = $ROOT + "\backend\server"
$FRONTEND = $ROOT + "\frontend"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   My-Tawjihe -- Demarrage         " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

# ── MongoDB service ───────────────────────────────────────────────────────────
Write-Host "[1/3] MongoDB..." -ForegroundColor Yellow
$svc = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
if ($svc) {
    if ($svc.Status -ne "Running") {
        Start-Service -Name "MongoDB"
        Start-Sleep 2
        Write-Host "  OK MongoDB service demarre" -ForegroundColor Green
    } else {
        Write-Host "  OK MongoDB deja actif" -ForegroundColor Green
    }
} else {
    Write-Host "  ERREUR : Service MongoDB introuvable." -ForegroundColor Red
    Write-Host "  Lance setup.ps1 d abord, ou installe MongoDB." -ForegroundColor Red
    Read-Host "Appuie sur Entree pour quitter"
    exit 1
}

# ── Backend ───────────────────────────────────────────────────────────────────
Write-Host "[2/3] Backend (port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$BACKEND'; npm start"
Start-Sleep 2
Write-Host "  OK Backend lance" -ForegroundColor Green

# ── Frontend ──────────────────────────────────────────────────────────────────
Write-Host "[3/3] Frontend (port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FRONTEND'; npm run dev"
Start-Sleep 2
Write-Host "  OK Frontend lance" -ForegroundColor Green

Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   Application disponible !        " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "  Admin    admin@test.com  / password" -ForegroundColor Gray
Write-Host "  Eleve    eleve1@test.com / password" -ForegroundColor Gray
Write-Host "  Prof     prof@test.com   / password" -ForegroundColor Gray
Write-Host "  Parent   parent@test.com / password" -ForegroundColor Gray
Write-Host ""
Read-Host "Appuie sur Entree pour fermer"
