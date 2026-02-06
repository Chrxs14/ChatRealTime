@echo off
REM Script para inicializar datos de desarrollo en Windows
REM Ejecutar después de clonar el repositorio

echo 🚀 Inicializando datos de desarrollo...

REM Crear archivo .env si no existe
if not exist .env (
    echo 📝 Creando archivo .env desde template...
    copy .env.example .env
    echo ✅ Archivo .env creado. ¡Recuerda configurar tus variables!
)

REM Crear archivo users.json si no existe
if not exist data\users.json (
    echo 👥 Creando archivo de usuarios de desarrollo...
    copy data\users.example.json data\users.json
    echo ✅ Archivo de usuarios creado con datos de ejemplo
)

REM Crear directorios necesarios
if not exist logs mkdir logs
if not exist uploads mkdir uploads
if not exist tmp mkdir tmp

echo.
echo 🎉 Inicialización completa!
echo.
echo 📋 Próximos pasos:
echo 1. Configura las variables en .env
echo 2. Ejecuta: npm install
echo 3. Ejecuta: npm start
echo.
echo 👤 Usuarios de prueba disponibles:
echo    - demo@example.com / (password: demo123)
echo    - admin@example.com / (password: admin123)
echo.
pause