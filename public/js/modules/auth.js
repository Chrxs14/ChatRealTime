// Manejador de autenticación
const AuthModule = {
    // Inicializar eventos de autenticación
    init() {
        this.setupEventListeners();
        
        // Si hay token guardado, intentar conectar directamente
        if (AuthService.getToken()) {
            AuthService.verifyToken();
        }
    },
    
    // Configurar eventos de los formularios
    setupEventListeners() {
        // Formulario de login
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        
        // Formulario de registro
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
    },
    
    // Manejar registro
    async handleRegister(e) {
        e.preventDefault();
        
        const username = document.getElementById('registerUsername').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        // Validaciones básicas
        if (!username || !email || !password) {
            Utils.showMessage('Todos los campos son requeridos', 'error');
            return;
        }
        
        if (!Utils.isValidEmail(email)) {
            Utils.showMessage('Email no válido', 'error');
            return;
        }
        
        if (password.length < 6) {
            Utils.showMessage('La contraseña debe tener al menos 6 caracteres', 'error');
            return;
        }
        
        // Llamar al servicio de autenticación
        await AuthService.register({ username, email, password });
    },
    
    // Manejar login
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        
        // Validaciones básicas
        if (!username || !password) {
            Utils.showMessage('Usuario y contraseña son requeridos', 'error');
            return;
        }
        
        // Llamar al servicio de autenticación
        await AuthService.login({ username, password });
    }
};

// Exportar como objeto global
window.AuthModule = AuthModule;