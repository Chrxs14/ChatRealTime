// 1. Importar dependencias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');

// 2. Importar módulos personalizados
const AuthService = require('./src/services/authService');
const SocketController = require('./src/controllers/socketController');
const Logger = require('./src/utils/logger');
const socketConfig = require('./src/config/socketConfig');
const { socketAuthMiddleware } = require('./src/middleware/auth');
const createMainRoutes = require('./src/routes');
const createAuthRoutes = require('./src/routes/auth');

// 3. Inicializar servicios
const authService = new AuthService();
const app = express();
const server = http.createServer(app);
const io = new Server(server, socketConfig);
const socketController = new SocketController(authService);

// 4. Configurar middleware de Express
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200
}));

// Security headers para producción
if (isProduction) {
    app.use((req, res, next) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        next();
    });
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 5. Configurar middleware de autenticación para Socket.io
io.use(socketAuthMiddleware(authService));

// 6. Configurar rutas de la API
app.use('/api', createMainRoutes(authService, socketController));
app.use('/api/auth', createAuthRoutes(authService));

// 7. Configurar eventos de Socket.io
io.on('connection', (socket) => {
    socketController.handleConnection(socket, io);
});

// 8. Manejo de errores de Socket.io
io.engine.on('connection_error', (err) => {
    Logger.error('Error de conexión Socket.io:', {
        message: err.message,
        description: err.description,
        context: err.context,
        type: err.type
    });
});

// 9. Configurar puerto y levantar servidor
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    Logger.server('=====================================');
    Logger.server(`🚀 Servidor iniciado en puerto ${PORT}`);
    Logger.server(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    Logger.server('⚡ Socket.io con autenticación configurado');
    Logger.server(`📡 API disponible en: http://localhost:${PORT}/api`);
    if (process.env.NODE_ENV === 'production') {
        Logger.server(`🌐 App desplegada en: ${process.env.FRONTEND_URL}`);
    }
    Logger.server('=====================================');
});

// 10. Manejo de errores del servidor
server.on('error', (error) => {
    Logger.error('Error del servidor:', error);
});

// 11. Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
    Logger.warn('Recibida señal SIGTERM. Cerrando servidor...');
    gracefulShutdown();
});

process.on('SIGINT', () => {
    Logger.warn('\nRecibida señal SIGINT. Cerrando servidor...');
    gracefulShutdown();
});

// Función para cierre graceful
function gracefulShutdown() {
    server.close(() => {
        Logger.success('Servidor cerrado correctamente');
        process.exit(0);
    });

    // Forzar cierre después de 10 segundos si no se cierra naturalmente
    setTimeout(() => {
        Logger.error('Forzando cierre del servidor');
        process.exit(1);
    }, 10000);
}

// 12. Exportar para testing
module.exports = { app, server, io, socketController, authService };