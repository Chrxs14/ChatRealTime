// Servicio de persistencia de mensajes
const MessageStorage = {
    // Configuración
    config: {
        maxMessages: 100, // Máximo de mensajes a guardar localmente
        storageKey: 'chatMessages',
        userStorageKey: 'chatUsers'
    },
    
    // Guardar mensaje en localStorage
    saveMessage(username, message, timestamp, isSystemMessage = false) {
        try {
            const messages = this.getStoredMessages();
            const newMessage = {
                id: Date.now() + Math.random(), // ID único
                username,
                message,
                timestamp: timestamp || new Date().toISOString(),
                isSystemMessage,
                date: new Date().toDateString() // Para agrupar por fecha
            };
            
            messages.push(newMessage);
            
            // Mantener solo los últimos N mensajes
            if (messages.length > this.config.maxMessages) {
                messages.splice(0, messages.length - this.config.maxMessages);
            }
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(messages));
            
        } catch (error) {
            console.warn('Error guardando mensaje en localStorage:', error);
        }
    },
    
    // Obtener mensajes almacenados
    getStoredMessages() {
        try {
            const stored = localStorage.getItem(this.config.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error leyendo mensajes del localStorage:', error);
            return [];
        }
    },
    
    // Limpiar mensajes antiguos (más de X días)
    cleanOldMessages(daysToKeep = 7) {
        try {
            const messages = this.getStoredMessages();
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
            
            const filteredMessages = messages.filter(msg => {
                const msgDate = new Date(msg.timestamp);
                return msgDate > cutoffDate;
            });
            
            localStorage.setItem(this.config.storageKey, JSON.stringify(filteredMessages));
            
        } catch (error) {
            console.warn('Error limpiando mensajes antiguos:', error);
        }
    },
    
    // Cargar historial en el chat
    loadHistoryToChat() {
        const messages = this.getStoredMessages();
        const messagesDiv = document.getElementById('messages');
        
        if (messages.length > 0) {
            // Mostrar indicador de carga
            messagesDiv.innerHTML = '<div class="message system-message">📜 Cargando historial...</div>';
            
            setTimeout(() => {
                // Limpiar chat actual
                messagesDiv.innerHTML = '';
                
                // Mostrar indicador de historial
                const historyIndicator = document.createElement('div');
                historyIndicator.className = 'message system-message history-indicator';
                historyIndicator.textContent = `📜 Historial cargado (${messages.length} mensajes)`;
                messagesDiv.appendChild(historyIndicator);
                
                // Cargar mensajes agrupados por fecha
                let currentDate = '';
                
                messages.forEach(msg => {
                    // Agregar separador de fecha si cambió
                    if (msg.date !== currentDate) {
                        const dateSeparator = document.createElement('div');
                        dateSeparator.className = 'date-separator';
                        dateSeparator.innerHTML = `<span>${this.formatDateSeparator(msg.date)}</span>`;
                        messagesDiv.appendChild(dateSeparator);
                        currentDate = msg.date;
                    }
                    
                    // Mostrar mensaje
                    if (msg.isSystemMessage) {
                        this.displayStoredSystemMessage(msg);
                    } else {
                        this.displayStoredMessage(msg);
                    }
                });
                
                // Scroll al final
                setTimeout(() => {
                    messagesDiv.scrollTop = messagesDiv.scrollHeight;
                }, 100);
            }, 300);
        }
    },
    
    // Mostrar mensaje almacenado
    displayStoredMessage(messageData) {
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message stored-message';
        
        const time = Utils.formatTime(messageData.timestamp);
        
        messageElement.innerHTML = `
            <div class="message-header">${messageData.username} - ${time}</div>
            <div class="message-content">${messageData.message}</div>
        `;
        
        messagesDiv.appendChild(messageElement);
    },
    
    // Mostrar mensaje de sistema almacenado
    displayStoredSystemMessage(messageData) {
        const messagesDiv = document.getElementById('messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'message system-message stored-message';
        messageElement.textContent = messageData.message;
        
        messagesDiv.appendChild(messageElement);
    },
    
    // Formatear separador de fecha
    formatDateSeparator(dateString) {
        const date = new Date(dateString);
        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (dateString === today) {
            return 'Hoy';
        } else if (dateString === yesterday.toDateString()) {
            return 'Ayer';
        } else {
            return date.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        }
    },
    
    // Limpiar todo el historial
    clearHistory() {
        localStorage.removeItem(this.config.storageKey);
        localStorage.removeItem(this.config.userStorageKey);
    },
    
    // Obtener estadísticas del historial
    getHistoryStats() {
        const messages = this.getStoredMessages();
        const stats = {
            totalMessages: messages.length,
            systemMessages: messages.filter(m => m.isSystemMessage).length,
            userMessages: messages.filter(m => !m.isSystemMessage).length,
            oldestMessage: messages.length > 0 ? messages[0].timestamp : null,
            newestMessage: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
            uniqueUsers: [...new Set(messages.filter(m => !m.isSystemMessage).map(m => m.username))]
        };
        return stats;
    }
};

// Exportar como objeto global
window.MessageStorage = MessageStorage;