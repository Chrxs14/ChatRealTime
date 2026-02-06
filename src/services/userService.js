class UserService {
    constructor() {
        this.connectedUsers = new Map();
    }

    /**
     * Agregar un nuevo usuario
     * @param {string} socketId - ID del socket
     * @param {string} username - Nombre del usuario
     * @param {string} email - Email del usuario
     * @returns {Object} - Información del usuario creado
     */
    addUser(socketId, username, email = null) {
        const userInfo = {
            id: socketId,
            username: username.trim(),
            email: email,
            joinedAt: new Date()
        };
        this.connectedUsers.set(socketId, userInfo);
        return userInfo;
    }

    /**
     * Eliminar usuario por socket ID
     * @param {string} socketId - ID del socket
     * @returns {Object|null} - Usuario eliminado o null si no existe
     */
    removeUser(socketId) {
        const user = this.connectedUsers.get(socketId);
        if (user) {
            this.connectedUsers.delete(socketId);
            return user;
        }
        return null;
    }

    /**
     * Obtener usuario por socket ID
     * @param {string} socketId - ID del socket
     * @returns {Object|null} - Usuario o null si no existe
     */
    getUser(socketId) {
        return this.connectedUsers.get(socketId) || null;
    }

    /**
     * Verificar si un nombre de usuario ya existe
     * @param {string} username - Nombre del usuario
     * @returns {boolean} - true si existe, false si no
     */
    userExists(username) {
        return Array.from(this.connectedUsers.values())
            .some(user => user.username === username.trim());
    }

    /**
     * Obtener lista de todos los usuarios conectados
     * @returns {Array} - Array con los nombres de usuario
     */
    getAllUsers() {
        return Array.from(this.connectedUsers.values())
            .map(user => user.username);
    }

    /**
     * Obtener información completa de todos los usuarios
     * @returns {Array} - Array con la información completa de usuarios
     */
    getAllUsersInfo() {
        return Array.from(this.connectedUsers.values());
    }

    /**
     * Obtener cantidad de usuarios conectados
     * @returns {number} - Número de usuarios conectados
     */
    getUserCount() {
        return this.connectedUsers.size;
    }

    /**
     * Validar nombre de usuario
     * @param {string} username - Nombre del usuario
     * @returns {Object} - {valid: boolean, error: string}
     */
    validateUsername(username) {
        if (!username || username.trim() === '') {
            return { valid: false, error: 'El nombre de usuario no puede estar vacío' };
        }

        if (username.trim().length < 2) {
            return { valid: false, error: 'El nombre de usuario debe tener al menos 2 caracteres' };
        }

        if (username.trim().length > 20) {
            return { valid: false, error: 'El nombre de usuario no puede tener más de 20 caracteres' };
        }

        if (this.userExists(username)) {
            return { valid: false, error: 'El nombre de usuario ya está en uso' };
        }

        return { valid: true, error: null };
    }
}

module.exports = UserService;