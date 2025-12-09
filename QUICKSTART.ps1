# Quick Start Guide - KJX Esports Application (Windows PowerShell)
# ================================================================

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║          🎮 KJX ESPORTS - APPLICATION QUICK START 🎮              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Configuration
$BACKEND_PATH = "d:\REPO\D-pression\Back-end"
$FRONTEND_PATH = "d:\REPO\D-pression\Front-end"
$DB_SERVER = "MICHAEL"
$DB_NAME = "Ultimate_db"
$DB_USER = "mika"

Write-Host "📋 Vérification des prérequis" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    Write-Host "✓ Java: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java NOT found" -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mvnVersion = mvn -version 2>&1 | Select-String "Apache Maven"
    Write-Host "✓ Maven: $mvnVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Maven NOT found" -ForegroundColor Red
    exit 1
}

# Check Node
try {
    $nodeVersion = node -v 2>&1
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js NOT found" -ForegroundColor Red
    exit 1
}

Write-Host "✓ SQL Server: $DB_SERVER`:1433" -ForegroundColor Green
Write-Host ""

# Check SQL Server Connection
Write-Host "🔍 Test de connexion SQL Server..." -ForegroundColor Yellow
try {
    sqlcmd -S $DB_SERVER -U $DB_USER -P "mikado" -Q "SELECT @@VERSION;" -o $null 2>&1
    Write-Host "✅ SQL Server accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ SQL Server NOT accessible" -ForegroundColor Red
    Write-Host "   → Vérifier que $DB_SERVER`:1433 est running" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Démarrage du Backend (Spring Boot)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

# Backend compilation
Push-Location $BACKEND_PATH

Write-Host "1️⃣  Maven clean compile..." -ForegroundColor Yellow
$compileOutput = mvn clean compile -DskipTests 2>&1
if (-not ($compileOutput | Select-String "BUILD SUCCESS")) {
    Write-Host "❌ Erreur de compilation" -ForegroundColor Red
    Write-Host $compileOutput
    exit 1
}
Write-Host "✅ Compilation réussie" -ForegroundColor Green

Write-Host ""
Write-Host "2️⃣  Démarrage Spring Boot (port 8080)..." -ForegroundColor Yellow
Write-Host "   🌐 URL: http://localhost:8080/api" -ForegroundColor Cyan
Write-Host "   ⏹️  Arrêter avec: Ctrl+C" -ForegroundColor Cyan
Write-Host ""

# Start backend in background job
$backendJob = Start-Job -ScriptBlock {
    cd $args[0]
    mvn spring-boot:run
} -ArgumentList $BACKEND_PATH

# Wait for backend to be ready
$timeout = 0
$backendReady = $false
while ($timeout -lt 30) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080/api/teams" -Method GET -TimeoutSec 2 -ErrorAction SilentlyContinue
        $backendReady = $true
        break
    } catch {
        Start-Sleep -Seconds 1
        $timeout++
    }
}

if ($backendReady) {
    Write-Host "✅ Backend prêt!" -ForegroundColor Green
} else {
    Write-Host "❌ Backend ne démarre pas" -ForegroundColor Red
    Stop-Job $backendJob
    exit 1
}

# Frontend
Write-Host ""
Write-Host "🎨 Démarrage du Frontend (Angular)" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Push-Location $FRONTEND_PATH

Write-Host "1️⃣  Installation des dépendances..." -ForegroundColor Yellow
$npmOutput = npm install 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur npm install" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dépendances installées" -ForegroundColor Green

Write-Host ""
Write-Host "2️⃣  Démarrage Angular (port 4200)..." -ForegroundColor Yellow
Write-Host "   🌐 URL: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""

# Start frontend in background job
$frontendJob = Start-Job -ScriptBlock {
    cd $args[0]
    ng serve
} -ArgumentList $FRONTEND_PATH

Start-Sleep -Seconds 5

# Final status
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✨ APPLICATION PRÊTE ✨                        ║" -ForegroundColor Green
Write-Host "╠════════════════════════════════════════════════════════════════════╣" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  🌐 Frontend:  http://localhost:4200                              ║" -ForegroundColor Green
Write-Host "║  🔌 Backend:   http://localhost:8080/api                          ║" -ForegroundColor Green
Write-Host "║  🗄️  Database:  $DB_SERVER`:1433 / $DB_NAME                              ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  📖 Documentation:                                                ║" -ForegroundColor Green
Write-Host "║    - Integration Guide: INTEGRATION_GUIDE.md                      ║" -ForegroundColor Green
Write-Host "║    - Backend Setup: Back-end/BACKEND_SETUP.md                    ║" -ForegroundColor Green
Write-Host "║    - Testing Guide: TESTING_GUIDE.md                             ║" -ForegroundColor Green
Write-Host "║    - Project Summary: PROJECT_SUMMARY.md                         ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  🧪 Tests (PowerShell):                                           ║" -ForegroundColor Green
Write-Host "║    - Invoke-WebRequest http://localhost:8080/api/teams           ║" -ForegroundColor Green
Write-Host "║    - Invoke-WebRequest http://localhost:8080/api/products        ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "║  🛑 Pour arrêter l'application:                                   ║" -ForegroundColor Green
Write-Host "║    1. Ctrl+C dans la fenêtre Backend (Maven)                     ║" -ForegroundColor Green
Write-Host "║    2. Ctrl+C dans la fenêtre Frontend (Angular)                  ║" -ForegroundColor Green
Write-Host "║                                                                    ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# Display running jobs
Write-Host "📊 Tâches en cours:" -ForegroundColor Cyan
Get-Job | Format-Table -Property Id, Name, State, HasMoreData

Write-Host ""
Write-Host "💡 Conseil: Ouvrir http://localhost:4200 dans le navigateur!" -ForegroundColor Yellow
Write-Host ""

# Keep the script running and monitoring jobs
while ($true) {
    if ((Get-Job $backendJob).State -eq "Failed" -or (Get-Job $frontendJob).State -eq "Failed") {
        Write-Host ""
        Write-Host "⚠️  Une tâche s'est arrêtée" -ForegroundColor Yellow
        break
    }
    Start-Sleep -Seconds 5
}
