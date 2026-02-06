// Utilidades generales
const Utils = {
    // Mostrar mensaje de notificación
    showMessage(message, type) {
        const container = document.getElementById('messageContainer');
        container.innerHTML = `<div class="${type}">${message}</div>`;
        
        // Auto-ocultar después del tiempo configurado
        setTimeout(() => {
            container.innerHTML = '';
        }, AppConfig.messages.autoHideDelay);
    },
    
    // Alternar entre formularios de login y registro
    toggleForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        loginForm.classList.toggle('hidden');
        registerForm.classList.toggle('hidden');
        
        // Limpiar mensajes
        document.getElementById('messageContainer').innerHTML = '';
    },
    
    // Validar email
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // Limpiar formularios
    clearForms() {
        document.getElementById('loginForm').reset();
        document.getElementById('registerForm').reset();
        document.getElementById('messageContainer').innerHTML = '';
        document.getElementById('messages').innerHTML = '';
    },
    
    // Formatear timestamp
    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString();
    }
};

// Exportar como objeto global
window.Utils = Utils;