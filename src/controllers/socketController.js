const UserService = require('../services/userService');
const MessageValidator = require('../validators/messageValidator');
const Logger = require('../utils/logger');

class SocketController {
    constructor(authService) {
        this.userService = new UserService();
        this.authService = authService;
    }

    /**
     * Manejar nueva conexión autenticada
     * @param {Object} socket - Socket del cliente
     * @param {Object} io - Instancia de Socket.io
     */
    handleConnection(socket, io) {
        const username = socket.userId; // Viene del middleware de auth
        const email = socket.userEmail;
        
        Logger.connection(`Usuario autenticado conectado: ${username} (${socket.id})`);

        // Auto-registrar usuario en la sesión de chat
        const userInfo = this.userService.addUser(socket.id, username, email);

        // Notificar conexión exitosa
        socket.emit('authenticated', {
            message: 'Conectado y autenticado exitosamente',
            user: {
                username: userInfo.username,
                email: userInfo.email
            }
        });

        // Notificar a otros usuarios
        socket.broadcast.emit('user_joined', {
            message: `${userInfo.username} se ha conectado al chat`,
            username: userInfo.username,
            timestamp: new Date()
        });

        // Enviar lista de usuarios conectados
        const usersList = this.userService.getAllUsers();
        socket.emit('users_list', { users: usersList });

        // Configurar eventos
        this.setupSocketEvents(socket, io);
    }

    /**
     * Configurar eventos del socket
     * @param {Object} socket - Socket del cliente
     * @param {Object} io - Instancia de Socket.io
     */
    setupSocketEvents(socket, io) {
        // Evento message - recibir y reenviar mensajes
        socket.on('message', (data) => {
            this.handleMessage(socket, io, data);
        });

        // Evento disconnect - limpiar lista
        socket.on('disconnect', () => {
            this.handleDisconnect(socket, io);
        });

        // Evento para obtener lista de usuarios
        socket.on('get_users', () => {
            this.handleGetUsers(socket);
        });

        // Evento para obtener perfil propio
        socket.on('get_profile', () => {
            this.handleGetProfile(socket);
        });

        // Evento para ping/pong
        socket.on('ping', () => {
            socket.emit('pong');
        });
    }

    /**
     * Manejar mensaje de usuario
     * @param {Object} socket - Socket del cliente
     * @param {Object} io - Instancia de Socket.io
     * @param {Object} data - Datos del mensaje
     */
    handleMessage(socket, io, data) {
        // El usuario ya está autenticado por middleware
        const user = this.userService.getUser(socket.id);
        if (!user) {
            socket.emit('message_error', { message: 'Usuario no encontrado en sesión activa' });
            return;
        }

        // Validar mensaje
        const validation = MessageValidator.validateMessage(data);
        if (!validation.valid) {
            socket.emit('message_error', { message: validation.error });
            Logger.warn(`Mensaje inválido de ${user.username}: ${validation.error}`);
            return;
        }

        // Crear objeto del mensaje
        const messageData = MessageValidator.createMessageObject(
            user.username,
            validation.sanitized,
            socket.id
        );

        // Difundir mensaje
        io.emit('message_broadcast', messageData);
        
        Logger.message(`Mensaje de ${user.username}: ${messageData.message}`);
    }

    /**
     * Manejar desconexión de usuario
     * @param {Object} socket - Socket del cliente
     * @param {Object} io - Instancia de Socket.io
     */
    handleDisconnect(socket, io) {
        const user = this.userService.removeUser(socket.id);
        
        if (user) {
            // Notificar desconexión
            socket.broadcast.emit('user_left', {
                message: `${user.username} ha abandonado el chat`,
                username: user.username,
                timestamp: new Date()
            });
            
            Logger.connection(`Usuario desconectado: ${user.username} (${socket.id})`);
        }
    }

    /**
     * Manejar solicitud de lista de usuarios
     * @param {Object} socket - Socket del cliente
     */
    handleGetUsers(socket) {
        const usersList = this.userService.getAllUsers();
        socket.emit('users_list', { users: usersList });
    }

    /**
     * Obtener perfil del usuario autenticado
     * @param {Object} socket - Socket del cliente
     */
    handleGetProfile(socket) {
        const user = this.userService.getUser(socket.id);
        if (user) {
            const userInfo = this.authService.getUserInfo(user.username);
            socket.emit('profile_data', {
                chatInfo: user,
                accountInfo: userInfo
            });
        }
    }

    /**
     * Obtener estadísticas del servidor
     * @returns {Object} - Estadísticas del servidor
     */
    getStats() {
        return {
            connectedUsers: this.userService.getUserCount(),
            users: this.userService.getAllUsersInfo(),
            authStats: this.authService.getStats()
        };
    }
}

module.exports = SocketController;