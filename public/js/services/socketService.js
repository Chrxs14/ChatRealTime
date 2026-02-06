// Servicio de Socket.IO
const SocketService = {
    socket: null,
    
    // Conectar al socket
    connect() {
        if (!AuthService.getToken()) {
            console.error('No hay token de autenticación');
            return;
        }
        
        this.socket = io({
            auth: {
                token: AuthService.getToken()
            }
        });
        
        this.setupEventListeners();
    },
    
    // Configurar eventos del socket
    setupEventListeners() {
        if (!this.socket) return;
        
        // Eventos de conexión
        this.socket.on('connect', () => {
            console.log('Conectado a Socket.io');
        });
        
        this.socket.on('authenticated', (data) => {
            console.log('Autenticado en Socket.io:', data);
        });
        
        // Eventos de mensajes
        this.socket.on('message_broadcast', (data) => {
            ChatManager.displayMessage(data.username, data.message, data.timestamp);
        });
        
        // Eventos de usuarios
        this.socket.on('user_joined', (data) => {
            ChatManager.displaySystemMessage(data.message);
        });
        
        this.socket.on('user_left', (data) => {
            ChatManager.displaySystemMessage(data.message);
        });
        
        this.socket.on('users_list', (data) => {
            ChatManager.updateUsersList(data.users);
        });
        
        // Eventos de error
        this.socket.on('message_error', (data) => {
            Utils.showMessage(data.message, 'error');
        });
        
        this.socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error.message);
            Utils.showMessage('Error de conexión al chat: ' + error.message, 'error');
            
            if (error.message.includes('Token')) {
                AuthService.logout();
            }
        });
    },
    
    // Enviar mensaje
    sendMessage(message) {
        if (this.socket && message.trim()) {
            this.socket.emit('message', { message: message.trim() });
            return true;
        }
        return false;
    },
    
    // Desconectar socket
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    },
    
    // Verificar si está conectado
    isConnected() {
        return this.socket && this.socket.connected;
    }
};

// Exportar como objeto global
window.SocketService = SocketService;