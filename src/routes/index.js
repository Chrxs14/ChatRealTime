const express = require('express');
const router = express.Router();
const { optionalAuthMiddleware } = require('../middleware/auth');

/**
 * Configurar rutas principales
 * @param {Object} authService - Servicio de autenticación
 * @param {Object} socketController - Controlador de sockets
 * @returns {Object} - Router configurado
 */
function createMainRoutes(authService, socketController) {
    
    // Middleware opcional de autenticación para todas las rutas
    router.use(optionalAuthMiddleware(authService));
    
    // Ruta principal
    router.get('/', (req, res) => {
        const response = {
            message: 'Servidor de Chat con Socket.io - Sistema de Autenticación',
            status: 'OK',
            timestamp: new Date(),
            authenticated: !!req.user,
            endpoints: {
                auth: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    verify: 'GET /api/auth/verify',
                    profile: 'GET /api/auth/profile',
                    logout: 'POST /api/auth/logout'
                },
                chat: {
                    health: 'GET /api/health',
                    stats: 'GET /api/stats'
                }
            },
            socketEvents: {
                connection: 'Requiere token de autenticación en handshake.auth.token',
                events: ['message', 'get_users', 'get_profile', 'ping']
            }
        };
        
        if (req.user) {
            response.user = req.user;
        }
        
        res.json(response);
    });

    // Ruta de health check
    router.get('/health', (req, res) => {
        res.json({
            status: 'healthy',
            uptime: process.uptime(),
            timestamp: new Date(),
            memory: process.memoryUsage(),
            authenticated: !!req.user
        });
    });

    // Ruta de estadísticas
    router.get('/stats', (req, res) => {
        try {
            const stats = socketController.getStats();
            res.json({
                ...stats,
                timestamp: new Date(),
                requestedBy: req.user ? req.user.username : 'anonymous'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Error obteniendo estadísticas',
                timestamp: new Date()
            });
        }
    });
    
    return router;
}

module.exports = createMainRoutes;