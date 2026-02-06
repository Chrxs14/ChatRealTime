#!/bin/bash

# Script para inicializar datos de desarrollo
# Ejecutar después de clonar el repositorio

echo "🚀 Inicializando datos de desarrollo..."

# Crear archivo .env si no existe
if [ ! -f .env ]; then
    echo "📝 Creando archivo .env desde template..."
    cp .env.example .env
    echo "✅ Archivo .env creado. ¡Recuerda configurar tus variables!"
fi

# Crear archivo users.json si no existe
if [ ! -f data/users.json ]; then
    echo "👥 Creando archivo de usuarios de desarrollo..."
    cp data/users.example.json data/users.json
    echo "✅ Archivo de usuarios creado con datos de ejemplo"
fi

# Crear directorios necesarios
mkdir -p logs
mkdir -p uploads
mkdir -p tmp

echo "🎉 Inicialización completa!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configura las variables en .env"
echo "2. Ejecuta: npm install"
echo "3. Ejecuta: npm start"
echo ""
echo "👤 Usuarios de prueba disponibles:"
echo "   - demo@example.com / (password: demo123)"
echo "   - admin@example.com / (password: admin123)"