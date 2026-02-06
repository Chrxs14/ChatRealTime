# 🚀 Sistema de Chat en Tiempo Real con Autenticación

Un sistema completo de chat en tiempo real desarrollado con Node.js, Express, Socket.IO y JWT para autenticación segura.

## 🏗️ Características Principales

### **🔐 Sistema de Autenticación**
- ✅ **Registro de usuarios** con validación de email y contraseña
- ✅ **Login seguro** con hash de contraseñas (bcryptjs)
- ✅ **Tokens JWT** para autenticación persistente
- ✅ **Middleware de autenticación** para Socket.io y Express
- ✅ **Gestión de sesiones** y auto-login

### **💬 Chat en Tiempo Real**
- ✅ **Comunicación instantánea** via Socket.IO
- ✅ **Múltiples usuarios** conectados simultáneamente
- ✅ **Lista de usuarios** conectados en tiempo real
- ✅ **Historial persistente** de mensajes
- ✅ **UI responsive** para móviles y desktop

### **🛡️ Seguridad**
- ✅ **Contraseñas encriptadas** con bcryptjs
- ✅ **JWT tokens** firmados y verificados
- ✅ **CORS configurado** para producción
- ✅ **Headers de seguridad** incluidos
- ✅ **Validación de entrada** de datos

## ⚡ Inicio Rápido

### **1. Clonar e Instalar**
```bash
git clone <tu-repositorio>
cd serverExpress
npm install
```

### **2. Configurar Variables de Entorno**
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

### **3. Inicializar Datos de Desarrollo**
```bash
# Windows
setup-dev.bat

# Linux/Mac  
chmod +x setup-dev.sh
./setup-dev.sh
```

### **4. Ejecutar la Aplicación**
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

### **5. Abrir en el Navegador**
```
http://localhost:3000
```

## 📁 Estructura del Proyecto

```
serverExpress/
├── server.js                     # Punto de entrada con autenticación
├── package.json                  # Dependencias actualizadas
├── README.md                     # Esta documentación
├── data/
│   └── users.json               # Base de datos de usuarios (auto-generada)
├── public/
│   └── index.html               # Cliente web de demostración
└── src/
    ├── config/
    │   └── socketConfig.js      # Configuración de Socket.io
    ├── controllers/
    │   └── socketController.js  # Controlador de eventos Socket.io
    ├── services/
    │   ├── authService.js       # 🆕 Servicio de autenticación
    │   └── userService.js       # Gestión de usuarios en sesión
    ├── middleware/
    │   └── auth.js              # 🆕 Middlewares de autenticación
    ├── validators/
    │   └── messageValidator.js  # Validación de mensajes
    ├── utils/
    │   └── logger.js            # Sistema de logging
    └── routes/
        ├── index.js             # Rutas principales
        └── auth.js              # 🆕 Rutas de autenticación
```

## 🚀 Comandos

### **Instalar dependencias:**
```bash
npm install
```

### **Iniciar servidor:**
```bash
npm start
# o
node server.js
```

### **Desarrollo con auto-reload:**
```bash
npm run dev
```

## 🌐 API REST - Endpoints de Autenticación

### **Registro de Usuario**
```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "usuario123",
    "email": "usuario@email.com", 
    "password": "contraseña123"
}
```

### **Login de Usuario**
```http
POST /api/auth/login
Content-Type: application/json

{
    "username": "usuario123",
    "password": "contraseña123"
}

# Respuesta:
{
    "success": true,
    "message": "Login exitoso",
    "user": { "username": "usuario123", "email": "usuario@email.com" },
    "token": "jwt-token-aqui"
}
```

### **Verificar Token**
```http
GET /api/auth/verify
Authorization: Bearer jwt-token-aqui
```

### **Obtener Perfil**
```http
GET /api/auth/profile  
Authorization: Bearer jwt-token-aqui
```

### **Logout**
```http
POST /api/auth/logout
Authorization: Bearer jwt-token-aqui
```

## 📡 Socket.io con Autenticación

### **Conexión Autenticada**
```javascript
const socket = io({
    auth: {
        token: 'jwt-token-del-login'
    }
});

// El middleware verifica automáticamente el token
// Si es válido, permite la conexión
// Si es inválido, rechaza con error
```

### **Eventos Disponibles**
#### **Del Servidor al Cliente:**
- `authenticated` - Confirmación de autenticación exitosa
- `message_broadcast` - Difusión de mensajes
- `user_joined/user_left` - Notificaciones de usuarios
- `users_list` - Lista de usuarios conectados
- `message_error` - Errores de mensajes

#### **Del Cliente al Servidor:**
- `message(data)` - Enviar mensaje
- `get_users()` - Obtener usuarios conectados
- `get_profile()` - Obtener perfil completo
- `ping()` - Mantener conexión

## 🎯 Flujo de Autenticación

### **1. Registro/Login Frontend**
```javascript
// Registro
const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});

const { token } = await loginResponse.json();
localStorage.setItem('authToken', token);
```

### **2. Conexión Socket.io**
```javascript
const socket = io({
    auth: { token: localStorage.getItem('authToken') }
});

socket.on('connect', () => {
    console.log('Conectado y autenticado');
});
```

## 🔒 Seguridad Implementada

### **Contraseñas**
- ✅ Hash con bcrypt (salt rounds: 10)
- ✅ Validación de longitud mínima (6 caracteres)
- ✅ Nunca se almacenan en texto plano

### **Tokens JWT**
- ✅ Firmados con secret key
- ✅ Expiración en 24 horas
- ✅ Incluyen información del usuario
- ✅ Verificación en cada request

### **Validaciones**
- ✅ Username: 3-20 caracteres, solo alfanuméricos y _
- ✅ Email: formato válido
- ✅ Mensajes: sanitización HTML, máx 500 caracteres
- ✅ Usuarios únicos por username y email

### **Persistencia**
- ✅ Usuarios guardados en archivo JSON
- ✅ Carga automática al iniciar servidor
- ✅ Backup automático en cada cambio

## 🖥️ Cliente Web Demo

Accede a `http://localhost:3000` para usar el cliente web incluido que demuestra:

- 📝 **Registro de nuevos usuarios**
- 🔐 **Login con usuarios existentes** 
- 💬 **Chat en tiempo real**
- 👥 **Lista de usuarios conectados**
- 🔄 **Persistencia de sesión** (tokens en localStorage)
- 🚪 **Logout seguro**

## 🛠️ Configuración de Entorno

### **Variables de Entorno (Opcionales)**
```bash
# .env
JWT_SECRET=tu-clave-secreta-super-segura
FRONTEND_URL=http://localhost:3001
PORT=3000
```

### **Estructura de Usuario**
```json
{
    "username": "usuario123",
    "email": "usuario@email.com",
    "password": "$2a$10$hash...", 
    "createdAt": "2026-02-06T04:20:00.000Z",
    "lastLogin": "2026-02-06T04:25:00.000Z",
    "isActive": true
}
```

## 🎉 Mejoras Implementadas

### **Para Desarrolladores Frontend**
- ✅ API REST estándar y documentada
- ✅ Respuestas JSON consistentes
- ✅ Códigos de estado HTTP apropiados
- ✅ CORS configurado para desarrollo
- ✅ Manejo de errores detallado

### **Para Usuarios Finales**
- ✅ Registro simple y rápido
- ✅ Login persistente (no se desloguea al cerrar pestaña)
- ✅ Interfaz amigable e intuitiva
- ✅ Mensajes de error claros
- ✅ Chat en tiempo real sin interrupciones

¡El sistema ahora está listo para producción con autenticación completa! 🎊# ChatRealTime
