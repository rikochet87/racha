@echo off
echo Cerrando Metro bundler...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul
echo Limpiando cache y reiniciando...
cd /d "%~dp0"
npx expo start --clear
