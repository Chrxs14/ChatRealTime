// Manejador de la interfaz de usuario
const UIManager = {
    // Mostrar sección de autenticación
    showAuthSection() {
        document.getElementById('chatSection').classList.add('hidden');
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('registerForm').classList.add('hidden');
        
        // Limpiar chat al mostrar auth
        ChatManager.clearChat();
    },
    
    // Mostrar sección de chat
    showChatSection() {
        const currentUser = AuthService.getCurrentUser();
        if (!currentUser) {
            console.error('No hay usuario autenticado');
            return;
        }
        
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('chatSection').classList.remove('hidden');
        
        // Mostrar información del usuario
        document.getElementById('currentUser').textContent = currentUser.username;
        document.getElementById('currentEmail').textContent = currentUser.email;
        
        // Cargar historial de mensajes
        if (typeof ChatManager !== 'undefined') {
            setTimeout(() => {
                ChatManager.loadChatHistory();
            }, 300);
        }
    },
    
    // Alternar entre formularios
    toggleAuthForm() {
        Utils.toggleForm();
    }
};

// Exportar como objeto global
window.UIManager = UIManager;

// Función global para compatibilidad con HTML inline
function toggleForm() {
    UIManager.toggleAuthForm();
}

function logout() {
    AuthService.logout();
}

function sendMessage() {
    ChatManager.sendMessage();
}