class MessageValidator {
    /**
     * Validar mensaje antes de enviarlo
     * @param {Object} data - Datos del mensaje
     * @returns {Object} - {valid: boolean, error: string, sanitized: string}
     */
    static validateMessage(data) {
        if (!data || typeof data !== 'object') {
            return { valid: false, error: 'Formato de mensaje inválido', sanitized: null };
        }

        if (!data.message || typeof data.message !== 'string') {
            return { valid: false, error: 'El mensaje debe ser una cadena de texto', sanitized: null };
        }

        const message = data.message.trim();

        if (message === '') {
            return { valid: false, error: 'El mensaje no puede estar vacío', sanitized: null };
        }

        if (message.length > 500) {
            return { valid: false, error: 'El mensaje no puede exceder 500 caracteres', sanitized: null };
        }

        // Sanitizar mensaje (remover caracteres especiales peligrosos)
        const sanitized = this.sanitizeMessage(message);

        return { valid: true, error: null, sanitized };
    }

    /**
     * Sanitizar mensaje removiendo contenido peligroso
     * @param {string} message - Mensaje a sanitizar
     * @returns {string} - Mensaje sanitizado
     */
    static sanitizeMessage(message) {
        return message
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
    }

    /**
     * Crear objeto de mensaje con metadatos
     * @param {string} username - Nombre del usuario
     * @param {string} message - Mensaje sanitizado
     * @param {string} socketId - ID del socket
     * @returns {Object} - Objeto del mensaje completo
     */
    static createMessageObject(username, message, socketId) {
        return {
            id: `${socketId}-${Date.now()}`,
            username,
            message,
            timestamp: new Date(),
            socketId
        };
    }
}

module.exports = MessageValidator;