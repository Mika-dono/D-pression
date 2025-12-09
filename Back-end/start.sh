#!/bin/bash
# Script pour démarrer Spring Boot et tester la connexion

echo "=========================================="
echo "KJX - Spring Boot Application Startup"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  Server: MICHAEL:1433"
echo "  Database: Ultimate_db"
echo "  User: mika"
echo ""
echo "Starting application..."
echo ""

cd "d:\REPO\D-pression\Back-end"
mvn spring-boot:run

echo ""
echo "=========================================="
echo "Application stopped"
echo "=========================================="
