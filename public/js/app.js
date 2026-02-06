// Aplicación principal
const App = {
    // Inicializar aplicación
    init() {
        console.log('🚀 Iniciando aplicación de chat...');
        
        // Verificar dependencias
        if (!this.checkDependencies()) {
            console.error('❌ Faltan dependencias requeridas');
            return;
        }
        
        // Inicializar módulos
        this.initializeModules();
        
        console.log('✅ Aplicación inicializada correctamente');
    },
    
    // Verificar dependencias
    checkDependencies() {
        const requiredGlobals = [
            'AppConfig', 'Utils', 'AuthService', 'SocketService', 
            'AuthModule', 'ChatManager', 'UIManager'
        ];
        
        for (const global of requiredGlobals) {
            if (typeof window[global] === 'undefined') {
                console.error(`❌ Dependencia faltante: ${global}`);
                return false;
            }
        }
        
        // Verificar socket.io
        if (typeof io === 'undefined') {
            console.error('❌ Socket.io no está cargado');
            return false;
        }
        
        return true;
    },
    
    // Inicializar módulos
    initializeModules() {
        try {
            // Inicializar módulo de autenticación
            AuthModule.init();
            
            // Inicializar manejador de chat
            ChatManager.init();
            
            console.log('✅ Módulos inicializados');
        } catch (error) {
            console.error('❌ Error al inicializar módulos:', error);
        }
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Exportar como objeto global para depuración
window.App = App;