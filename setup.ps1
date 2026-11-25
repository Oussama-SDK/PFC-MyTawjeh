# ── CONFIGURATION ─────────────────────────────────────────────────────────────
# Never hardcode the key here — read it from the environment or ask for it.
$OPENROUTER_API_KEY = $env:OPENROUTER_API_KEY
if (-not $OPENROUTER_API_KEY) {
    $OPENROUTER_API_KEY = Read-Host "Cle API OpenRouter (https://openrouter.ai/keys)"
}
# ──────────────────────────────────────────────────────────────────────────────

$ErrorActionPreference = "Stop"

# Detect project root
$SCRIPT_PATH = $MyInvocation.MyCommand.Path
$PROJECT_ROOT = Split-Path $SCRIPT_PATH -Parent
$BACKEND = $PROJECT_ROOT + "\backend\server"
$FRONTEND = $PROJECT_ROOT + "\frontend"

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  My-Tawjihe -- Setup automatique  " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Dossier projet : $PROJECT_ROOT" -ForegroundColor Gray
Write-Host ""

# ── 1. Node.js ────────────────────────────────────────────────────────────────
Write-Host "[1/7] Verification Node.js..." -ForegroundColor Yellow
$nodeVer = node --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  ERREUR : Node.js non installe." -ForegroundColor Red
    Write-Host "  Telecharge ici : https://nodejs.org" -ForegroundColor Red
    Read-Host "Appuie sur Entree pour quitter"
    exit 1
}
Write-Host "  OK Node.js $nodeVer" -ForegroundColor Green

# ── 2. backend .env ───────────────────────────────────────────────────────────
Write-Host "[2/7] Creation backend\.env..." -ForegroundColor Yellow
$JWT = node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
$backendEnv = @"
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/my_tawjihe

JWT_SECRET=$JWT

AI_PROVIDER=openrouter
OPENROUTER_API_KEY=$OPENROUTER_API_KEY
OPENROUTER_MODEL=google/gemma-4-31b-it:free
"@
Set-Content -Path "$BACKEND\.env" -Value $backendEnv -Encoding UTF8
Write-Host "  OK backend\.env cree" -ForegroundColor Green

# ── 3. frontend .env ──────────────────────────────────────────────────────────
Write-Host "[3/7] Creation frontend\.env..." -ForegroundColor Yellow
Set-Content -Path "$FRONTEND\.env" -Value "VITE_API_URL=http://localhost:5000/api" -Encoding UTF8
Write-Host "  OK frontend\.env cree" -ForegroundColor Green

# ── 4. npm install backend ────────────────────────────────────────────────────
Write-Host "[4/7] Installation dependances backend..." -ForegroundColor Yellow
Set-Location $BACKEND
npm install --silent
if ($LASTEXITCODE -ne 0) { Write-Host "  ERREUR npm install backend" -ForegroundColor Red; exit 1 }
Write-Host "  OK backend pret" -ForegroundColor Green

# ── 5. npm install frontend ───────────────────────────────────────────────────
Write-Host "[5/7] Installation dependances frontend..." -ForegroundColor Yellow
Set-Location $FRONTEND
npm install --silent
if ($LASTEXITCODE -ne 0) { Write-Host "  ERREUR npm install frontend" -ForegroundColor Red; exit 1 }
Write-Host "  OK frontend pret" -ForegroundColor Green

# ── 6. MongoDB ────────────────────────────────────────────────────────────────
Write-Host "[6/7] Demarrage MongoDB..." -ForegroundColor Yellow
$mongoCheck = netstat -an | Select-String "27017.*LISTENING"
if ($mongoCheck) {
    Write-Host "  OK MongoDB deja actif" -ForegroundColor Green
} else {
    $svc = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue
    if ($svc) {
        Start-Service MongoDB -ErrorAction SilentlyContinue
        Start-Sleep 3
        Write-Host "  OK MongoDB service demarre" -ForegroundColor Green
    } else {
        $mongoPaths = @(
            "C:\Program Files\MongoDB\Server\8.3\bin\mongod.exe",
            "C:\Program Files\MongoDB\Server\8.0\bin\mongod.exe",
            "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"
        )
        $mongod = $mongoPaths | Where-Object { Test-Path $_ } | Select-Object -First 1
        if (-not $mongod) {
            $cmd = Get-Command mongod -ErrorAction SilentlyContinue
            if ($cmd) { $mongod = $cmd.Source }
        }
        if (-not $mongod) {
            Write-Host "  ERREUR : MongoDB non trouve." -ForegroundColor Red
            Write-Host "  Telecharge ici : https://www.mongodb.com/try/download/community" -ForegroundColor Red
            Read-Host "Appuie sur Entree pour quitter"
            exit 1
        }
        $dataPath = $BACKEND + "\.mongodb\data"
        $logPath  = $BACKEND + "\.mongodb\mongod.log"
        New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
        Start-Process -FilePath $mongod -ArgumentList "--dbpath `"$dataPath`" --logpath `"$logPath`" --bind_ip 127.0.0.1 --port 27017" -WindowStyle Hidden
        Start-Sleep 4
        Write-Host "  OK MongoDB demarre" -ForegroundColor Green
    }
}

# ── 7. Seed ───────────────────────────────────────────────────────────────────
Write-Host "[7/7] Chargement des comptes de test..." -ForegroundColor Yellow
Set-Location $BACKEND
$ErrorActionPreference = "SilentlyContinue"
node scripts/seedUsers.js 2>$null | Out-Null
$ErrorActionPreference = "Stop"
Write-Host "  OK comptes crees" -ForegroundColor Green

# ── Lancement ─────────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "  Lancement de l application...    " -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$BACKEND'; Write-Host '--- BACKEND port 5000 ---' -ForegroundColor Cyan; npm start"
Start-Sleep 2
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$FRONTEND'; Write-Host '--- FRONTEND port 5173 ---' -ForegroundColor Cyan; npm run dev"
Start-Sleep 3

Write-Host "  Application lancee !" -ForegroundColor Green
Write-Host ""
Write-Host "  Frontend  ->  http://localhost:5173" -ForegroundColor White
Write-Host "  Backend   ->  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "  Comptes de test :" -ForegroundColor Yellow
Write-Host "    Admin    admin@test.com   / password" -ForegroundColor White
Write-Host "    Eleve    eleve1@test.com  / password" -ForegroundColor White
Write-Host "    Prof     prof@test.com    / password" -ForegroundColor White
Write-Host "    Parent   parent@test.com  / password" -ForegroundColor White
Write-Host ""
Read-Host "Appuie sur Entree pour fermer"
