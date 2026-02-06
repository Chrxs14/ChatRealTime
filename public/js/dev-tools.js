// Herramienta de desarrollo para facilitar el trabajo con la UI modularizada
const DevTools = {
    // Información de la aplicación
    info() {
        console.log(`
🚀 CHAT UI - MODO DESARROLLO
===========================
✅ Estructura modularizada activa
✅ ${Object.keys(window).filter(k => k.includes('Service') || k.includes('Manager') || k.includes('Module')).length} módulos cargados
✅ Configuración: window.AppConfig
        `);
        
        this.listModules();
    },
    
    // Listar módulos cargados
    listModules() {
        console.log('📦 MÓDULOS DISPONIBLES:');
        const modules = Object.keys(window).filter(k => 
            k.includes('Service') || k.includes('Manager') || k.includes('Module') || 
            k === 'App' || k === 'Utils'
        );
        
        modules.forEach(module => {
            console.log(`   → ${module}`);
        });
    },
    
    // Debug de autenticación
    authDebug() {
        console.log('🔐 ESTADO DE AUTENTICACIÓN:');
        console.log('   Token:', AuthService.getToken() ? '✅ Presente' : '❌ No encontrado');
        console.log('   Usuario:', AuthService.getCurrentUser());
        console.log('   Autenticado:', AuthService.isAuthenticated());
    },
    
    // Debug de socket
    socketDebug() {
        console.log('🔌 ESTADO DE SOCKET:');
        console.log('   Conectado:', SocketService.isConnected());
        console.log('   Socket:', SocketService.socket);
    },
    
    // Limpiar localStorage (útil para testing)
    clearStorage() {
        localStorage.clear();
        console.log('🗑️ localStorage limpiado');
        console.log('💡 Recarga la página para ver efectos');
    },
    
    // Simular mensaje para testing
    testMessage(username = 'TestUser', message = 'Mensaje de prueba', timestamp = new Date()) {
        ChatManager.displayMessage(username, message, timestamp);
        console.log('💬 Mensaje de prueba agregado');
    },
    
    // Ver configuración actual
    showConfig() {
        console.log('⚙️ CONFIGURACIÓN ACTUAL:');
        console.table(AppConfig);
    },
    
    // Ver estadísticas del historial
    historyStats() {
        if (typeof ChatManager !== 'undefined') {
            ChatManager.showHistoryStats();
        } else {
            console.log('❌ ChatManager no disponible');
        }
    },
    
    // Limpiar historial de chat
    clearHistory() {
        if (typeof ChatManager !== 'undefined') {
            const confirm = window.confirm('¿Estás seguro de que quieres limpiar todo el historial?');
            if (confirm) {
                ChatManager.clearChatHistory();
                console.log('🗑️ Historial limpiado');
            }
        } else {
            console.log('❌ ChatManager no disponible');
        }
    },
    
    // Cargar historial manualmente
    loadHistory() {
        if (typeof ChatManager !== 'undefined') {
            ChatManager.loadChatHistory();
            console.log('📜 Historial cargado');
        } else {
            console.log('❌ ChatManager no disponible');
        }
    },
    
    // Recargar módulos (útil durante desarrollo)
    reloadModules() {
        console.log('🔄 Para recargar módulos, recarga la página (F5)');
        console.log('💡 Tip: Usa Live Server para recarga automática');
    },
    
    // Ayuda de comandos
    help() {
        console.log(`
🛠️ HERRAMIENTAS DE DESARROLLO DISPONIBLES:
=========================================
DevTools.info()         - Información general
DevTools.listModules()  - Listar módulos cargados
DevTools.authDebug()    - Estado de autenticación  
DevTools.socketDebug()  - Estado de socket
DevTools.clearStorage() - Limpiar localStorage
DevTools.testMessage()  - Agregar mensaje de prueba
DevTools.showConfig()   - Ver configuración
DevTools.historyStats() - Estadísticas del historial
DevTools.clearHistory() - Limpiar historial de chat
DevTools.loadHistory()  - Cargar historial manualmente
DevTools.help()         - Esta ayuda

📦 ACCESO DIRECTO A MÓDULOS:
===========================
AuthService     - Servicio de autenticación
SocketService   - Servicio de socket  
MessageStorage  - Almacenamiento de mensajes
ChatManager     - Manejador de chat
UIManager       - Manejador de UI
Utils           - Utilidades
AppConfig       - Configuración

💡 TIPS DE DESARROLLO:
=====================
- Usa DevTools.historyStats() para ver estadísticas del chat
- Los mensajes persisten automáticamente en localStorage
- DevTools.clearHistory() borra todo el historial guardado
- El historial se limpia automáticamente después de 7 días
        `);
    }
};

// Hacer disponible globalmente solo en desarrollo
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.DevTools = DevTools;
    
    // Mensaje de bienvenida en desarrollo
    console.log('%c🚀 MODO DESARROLLO ACTIVO', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
    console.log('%cEscribe DevTools.help() para ver comandos disponibles', 'color: #2196F3;');
}