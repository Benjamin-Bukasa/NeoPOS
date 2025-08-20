@echo off
:: ===============================================
:: Script automatique pour démarrer le projet PERN
:: Backend : 5000 | Frontend Vite : 5173
:: ===============================================

:: 1️⃣ Démarrage du backend Node/Express sur le port 5000
echo Démarrage du backend sur le port 5000...
cd /d "C:\Program Files\NeoPOS\back-end"
start cmd /k "set PORT=5000 && npm run server"

:: 2️⃣ Démarrage du frontend Vite sur le port 5173
echo Démarrage du frontend sur le port 5173...
cd /d "C:\Program Files\NeoPOS\front-end"
start cmd /k "set PORT=5173 && npm run dev"

echo ===============================================
echo Backend et Frontend du projet PERN sont lancés !
pause
