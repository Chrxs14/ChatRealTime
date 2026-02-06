// Configuración global de la aplicación
const AppConfig = {
    api: {
        baseUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            ? '/api'  // Desarrollo local
            : '/api', // Producción (mismo dominio)
        endpoints: {
            register: '/auth/register',
            login: '/auth/login',
            verify: '/auth/verify'
        }
    },
    
    localStorage: {
        tokenKey: 'authToken'
    },
    
    messages: {
        autoHideDelay: 5000,
        connectionError: 'Error de conexión',
        loginSuccess: '¡Inicio de sesión exitoso!',
        registerSuccess: '¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.',
        logoutSuccess: 'Sesión cerrada exitosamente'
    },
    
    socket: {
        connectionDelay: 1000
    }
};

// Exportar configuración como objeto global
window.AppConfig = AppConfig;