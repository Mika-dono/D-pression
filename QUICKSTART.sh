#!/bin/bash
# Quick Start Guide - KJX Esports Application
# =============================================

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║          🎮 KJX ESPORTS - APPLICATION QUICK START 🎮              ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
BACKEND_PATH="d:\REPO\D-pression\Back-end"
FRONTEND_PATH="d:\REPO\D-pression\Front-end"
DB_SERVER="MICHAEL"
DB_NAME="Ultimate_db"
DB_USER="mika"

echo "📋 Prérequis"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✓ Java 17+ : $(java -version 2>&1 | head -1)"
echo "✓ Maven 3.9+: $(mvn -version 2>&1 | head -1)"
echo "✓ Node.js 18+: $(node -v 2>/dev/null || echo 'Not installed')"
echo "✓ SQL Server: Accessible sur $DB_SERVER:1433"
echo ""

# Check SQL Server
echo "🔍 Vérification SQL Server..."
sqlcmd -S $DB_SERVER -U $DB_USER -P mikado -Q "SELECT @@VERSION;" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ SQL Server accessible"
else
    echo "❌ SQL Server NOT accessible"
    echo "   → Vérifier que $DB_SERVER:1433 est running"
    exit 1
fi

# Backend Start
echo ""
echo "🚀 Démarrage du Backend (Spring Boot)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$BACKEND_PATH"

echo "1️⃣  Maven clean compile..."
mvn clean compile -DskipTests > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erreur de compilation"
    mvn clean compile -DskipTests
    exit 1
fi
echo "✅ Compilation réussie"

echo ""
echo "2️⃣  Démarrage Spring Boot (port 8080)..."
echo "   URL: http://localhost:8080/api"
echo "   Arrêter avec: Ctrl+C"
echo ""
timeout=0
while ! curl -s http://localhost:8080/api/teams > /dev/null 2>&1; do
    sleep 1
    timeout=$((timeout+1))
    if [ $timeout -gt 30 ]; then
        echo "❌ Backend ne démarre pas"
        exit 1
    fi
done
echo "✅ Backend prêt!"

# Frontend Start (in background)
echo ""
echo "🎨 Démarrage du Frontend (Angular)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd "$FRONTEND_PATH"

echo "1️⃣  Installation des dépendances..."
npm install > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Erreur npm install"
    npm install
    exit 1
fi
echo "✅ Dépendances installées"

echo ""
echo "2️⃣  Démarrage Angular (port 4200)..."
echo "   URL: http://localhost:4200"
echo ""
ng serve &

sleep 5
if curl -s http://localhost:4200 > /dev/null 2>&1; then
    echo "✅ Frontend prêt!"
else
    echo "⚠️  Frontend en cours de démarrage..."
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    ✨ APPLICATION PRÊTE ✨                        ║"
echo "╠════════════════════════════════════════════════════════════════════╣"
echo "║                                                                    ║"
echo "║  🌐 Frontend:  http://localhost:4200                              ║"
echo "║  🔌 Backend:   http://localhost:8080/api                          ║"
echo "║  🗄️  Database:  $DB_SERVER:1433 / $DB_NAME              ║"
echo "║                                                                    ║"
echo "║  📖 Documentation:                                                ║"
echo "║    - Integration Guide: INTEGRATION_GUIDE.md                      ║"
echo "║    - Backend Setup: Back-end/BACKEND_SETUP.md                    ║"
echo "║    - Testing Guide: TESTING_GUIDE.md                             ║"
echo "║    - Project Summary: PROJECT_SUMMARY.md                         ║"
echo "║                                                                    ║"
echo "║  🧪 Tests:                                                        ║"
echo "║    - curl http://localhost:8080/api/teams                        ║"
echo "║    - curl http://localhost:8080/api/products                     ║"
echo "║                                                                    ║"
echo "║  🛑 Pour arrêter l'application:                                   ║"
echo "║    - Backend: Ctrl+C                                             ║"
echo "║    - Frontend: Ctrl+C                                            ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# Keep script running
wait
