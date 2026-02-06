// Manejador del chat
const ChatManager = {
    // Inicializar funcionalidades del chat
    init() {
        this.setupEventListeners();
        this.setupScrollEvents();
    },
    
    // Configurar eventos del chat
    setupEventListeners() {
        // Enter para enviar mensaje
        document.getElementById('messageInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Botón de enviar mensaje
        document.querySelector('[onclick="sendMessage()"]').onclick = () => this.sendMessage();
        
        // Botón de logout
        document.querySelector('[onclick="logout()"]').onclick = () => AuthService.logout();
    },
    
    // Enviar mensaje
    sendMessage() {
        const messageInput = document.getElementById('messageInput');
        const message = messageInput.value.trim();
        
        if (message && SocketService.sendMessage(message)) {
            messageInput.value = '';
        }
    },
    
    // Mostrar mensaje en el chat
    displayMessage(username, message, timestamp) {
        const messagesDiv = document.getElementById('messages');
        const wasNearBottom = this.isNearBottom();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        
        const time = Utils.formatTime(timestamp);
        
        messageElement.innerHTML = `
            <div class="message-header">${username} - ${time}</div>
            <div class="message-content">${message}</div>
        `;
        
        messagesDiv.appendChild(messageElement);
        
        // Guardar mensaje en localStorage
        if (typeof MessageStorage !== 'undefined') {
            MessageStorage.saveMessage(username, message, timestamp, false);
        }
        
        // Solo hacer scroll si el usuario estaba cerca del final
        if (wasNearBottom) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 10);
        } else {
            // Mostrar botón para ir al final
            this.showScrollButton();
        }
    },
    
    // Mostrar mensaje del sistema
    displaySystemMessage(message) {
        const messagesDiv = document.getElementById('messages');
        const wasNearBottom = this.isNearBottom();
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message system-message';
        messageElement.textContent = message;
        
        messagesDiv.appendChild(messageElement);
        
        // Guardar mensaje de sistema en localStorage
        if (typeof MessageStorage !== 'undefined') {
            MessageStorage.saveMessage('Sistema', message, new Date().toISOString(), true);
        }
        
        // Solo hacer scroll si el usuario estaba cerca del final
        if (wasNearBottom) {
            setTimeout(() => {
                this.scrollToBottom();
            }, 10);
        }
    },
    
    // Actualizar lista de usuarios
    updateUsersList(users) {
        document.getElementById('onlineUsers').textContent = users.join(', ');
    },
    
    // Limpiar chat (sin borrar historial)
    clearChat() {
        document.getElementById('messages').innerHTML = '';
        document.getElementById('messageInput').value = '';
        document.getElementById('onlineUsers').textContent = 'Cargando...';
    },
    
    // Cargar historial de mensajes
    loadChatHistory() {
        if (typeof MessageStorage !== 'undefined') {
            // Limpiar mensajes antiguos primero
            MessageStorage.cleanOldMessages(7); // Mantener últimos 7 días
            
            // Cargar historial
            MessageStorage.loadHistoryToChat();
        }
    },
    
    // Limpiar historial completo
    clearChatHistory() {
        if (typeof MessageStorage !== 'undefined') {
            MessageStorage.clearHistory();
            this.clearChat();
            Utils.showMessage('Historial de chat limpiado', 'success');
        }
    },
    
    // Obtener estadísticas del historial
    getHistoryStats() {
        if (typeof MessageStorage !== 'undefined') {
            return MessageStorage.getHistoryStats();
        }
        return null;
    },
    
    // Mostrar estadísticas en consola (para debugging)
    showHistoryStats() {
        const stats = this.getHistoryStats();
        if (stats) {
            console.log('📊 ESTADÍSTICAS DEL HISTORIAL:');
            console.log(`   📝 Total de mensajes: ${stats.totalMessages}`);
            console.log(`   👤 Mensajes de usuario: ${stats.userMessages}`);
            console.log(`   🤖 Mensajes del sistema: ${stats.systemMessages}`);
            console.log(`   👥 Usuarios únicos: ${stats.uniqueUsers.length}`);
            console.log(`   📅 Desde: ${stats.oldestMessage ? new Date(stats.oldestMessage).toLocaleString() : 'N/A'}`);
            console.log(`   📅 Hasta: ${stats.newestMessage ? new Date(stats.newestMessage).toLocaleString() : 'N/A'}`);
        }
    },
    
    // Verificar si el usuario está cerca del fondo del chat
    isNearBottom() {
        const messagesDiv = document.getElementById('messages');
        const threshold = 50; // píxeles
        return messagesDiv.scrollTop + messagesDiv.clientHeight >= messagesDiv.scrollHeight - threshold;
    },
    
    // Ir al final del chat
    scrollToBottom() {
        const messagesDiv = document.getElementById('messages');
        messagesDiv.scrollTo({
            top: messagesDiv.scrollHeight,
            behavior: 'smooth'
        });
        
        // Ocultar el botón después de hacer scroll
        this.hideScrollButton();
    },
    
    // Mostrar botón para ir al final
    showScrollButton() {
        const btn = document.getElementById('scrollToBottomBtn');
        if (btn) {
            btn.classList.remove('hidden');
        }
    },
    
    // Ocultar botón para ir al final
    hideScrollButton() {
        const btn = document.getElementById('scrollToBottomBtn');
        if (btn) {
            btn.classList.add('hidden');
        }
    },
    
    // Configurar eventos de scroll para manejar el botón
    setupScrollEvents() {
        const messagesDiv = document.getElementById('messages');
        let scrollTimeout;
        
        messagesDiv.addEventListener('scroll', () => {
            // Limpiar timeout previo
            clearTimeout(scrollTimeout);
            
            // Esperar un poco después del scroll para verificar posición
            scrollTimeout = setTimeout(() => {
                if (this.isNearBottom()) {
                    this.hideScrollButton();
                }
            }, 100);
        });
    }
};

// Exportar como objeto global
window.ChatManager = ChatManager;