const Logger = require('../utils/logger');

/**
 * Middleware de autenticación para Socket.io
 * @param {Object} authService - Servicio de autenticación
 * @returns {Function} - Función middleware
 */
function socketAuthMiddleware(authService) {
    return (socket, next) => {
        const token = socket.handshake.auth.token;
        
        if (!token) {
            Logger.warn(`Conexión rechazada - sin token: ${socket.id}`);
            return next(new Error('Token de autenticación requerido'));
        }

        const verification = authService.verifyToken(token);
        if (!verification.valid) {
            Logger.warn(`Conexión rechazada - token inválido: ${socket.id}`);
            return next(new Error(verification.error));
        }

        // Agregar información del usuario al socket
        socket.userId = verification.user.username;
        socket.userEmail = verification.user.email;
        
        Logger.info(`Usuario autenticado via Socket.io: ${verification.user.username}`);
        next();
    };
}

/**
 * Middleware de autenticación para rutas Express
 * @param {Object} authService - Servicio de autenticación
 * @returns {Function} - Función middleware
 */
function expressAuthMiddleware(authService) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ error: 'Token de acceso requerido' });
        }

        const verification = authService.verifyToken(token);
        if (!verification.valid) {
            return res.status(401).json({ error: verification.error });
        }

        // Agregar información del usuario al request
        req.user = verification.user;
        next();
    };
}

/**
 * Middleware opcional de autenticación (no bloquea si no hay token)
 * @param {Object} authService - Servicio de autenticación
 * @returns {Function} - Función middleware
 */
function optionalAuthMiddleware(authService) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            const verification = authService.verifyToken(token);
            if (verification.valid) {
                req.user = verification.user;
            }
        }
        
        next();
    };
}

module.exports = {
    socketAuthMiddleware,
    expressAuthMiddleware,
    optionalAuthMiddleware
};