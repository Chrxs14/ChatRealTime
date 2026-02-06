const express = require('express');
const router = express.Router();
const Logger = require('../utils/logger');
const { expressAuthMiddleware } = require('../middleware/auth');

/**
 * Configurar rutas de autenticación
 * @param {Object} authService - Servicio de autenticación
 * @returns {Object} - Router configurado
 */
function createAuthRoutes(authService) {
    
    // Registro de usuario
    router.post('/register', async (req, res) => {
        try {
            const { username, email, password } = req.body;
            
            Logger.info(`Intento de registro: ${username}`);
            
            const result = await authService.registerUser(username, email, password);
            
            if (result.success) {
                res.status(201).json({
                    success: true,
                    message: result.message,
                    user: result.user
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            Logger.error('Error en endpoint de registro:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });

    // Login de usuario
    router.post('/login', async (req, res) => {
        try {
            const { username, password } = req.body;
            
            Logger.info(`Intento de login: ${username}`);
            
            const result = await authService.loginUser(username, password);
            
            if (result.success) {
                res.json({
                    success: true,
                    message: result.message,
                    user: result.user,
                    token: result.token
                });
            } else {
                res.status(401).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            Logger.error('Error en endpoint de login:', error);
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    });

    // Verificar token
    router.get('/verify', expressAuthMiddleware(authService), (req, res) => {
        res.json({
            success: true,
            user: req.user,
            message: 'Token válido'
        });
    });

    // Obtener perfil de usuario
    router.get('/profile', expressAuthMiddleware(authService), (req, res) => {
        const userInfo = authService.getUserInfo(req.user.username);
        if (userInfo) {
            res.json({
                success: true,
                user: userInfo
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }
    });

    // Logout (invalidación de token en el cliente)
    router.post('/logout', expressAuthMiddleware(authService), (req, res) => {
        Logger.info(`Usuario deslogueado: ${req.user.username}`);
        res.json({
            success: true,
            message: 'Logout exitoso'
        });
    });

    return router;
}

module.exports = createAuthRoutes;