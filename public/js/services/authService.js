// Servicio de autenticación
const AuthService = {
    // Token actual
    authToken: localStorage.getItem(AppConfig.localStorage.tokenKey),
    currentUser: null,
    
    // Manejar registro
    async register(userData) {
        try {
            const response = await fetch(AppConfig.api.baseUrl + AppConfig.api.endpoints.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                Utils.showMessage(AppConfig.messages.registerSuccess, 'success');
                Utils.toggleForm(); // Cambiar a formulario de login
                return { success: true };
            } else {
                Utils.showMessage(result.error, 'error');
                return { success: false, error: result.error };
            }
        } catch (error) {
            Utils.showMessage(AppConfig.messages.connectionError, 'error');
            return { success: false, error: AppConfig.messages.connectionError };
        }
    },
    
    // Manejar login
    async login(credentials) {
        try {
            const response = await fetch(AppConfig.api.baseUrl + AppConfig.api.endpoints.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.authToken = result.token;
                localStorage.setItem(AppConfig.localStorage.tokenKey, this.authToken);
                this.currentUser = result.user;
                
                Utils.showMessage(AppConfig.messages.loginSuccess, 'success');
                
                setTimeout(() => {
                    UIManager.showChatSection();
                    SocketService.connect();
                }, AppConfig.socket.connectionDelay);
                
                return { success: true, user: result.user, token: result.token };
            } else {
                Utils.showMessage(result.error, 'error');
                return { success: false, error: result.error };
            }
        } catch (error) {
            Utils.showMessage(AppConfig.messages.connectionError, 'error');
            return { success: false, error: AppConfig.messages.connectionError };
        }
    },
    
    // Verificar token existente
    async verifyToken() {
        if (!this.authToken) return { success: false };
        
        try {
            const response = await fetch(AppConfig.api.baseUrl + AppConfig.api.endpoints.verify, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentUser = result.user;
                UIManager.showChatSection();
                SocketService.connect();
                return { success: true, user: result.user };
            } else {
                this.logout();
                return { success: false };
            }
        } catch (error) {
            this.logout();
            return { success: false };
        }
    },
    
    // Cerrar sesión
    logout() {
        if (SocketService.socket) {
            SocketService.disconnect();
        }
        
        localStorage.removeItem(AppConfig.localStorage.tokenKey);
        this.authToken = null;
        this.currentUser = null;
        
        Utils.clearForms();
        UIManager.showAuthSection();
        Utils.showMessage(AppConfig.messages.logoutSuccess, 'success');
    },
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    },
    
    // Obtener token actual
    getToken() {
        return this.authToken;
    },
    
    // Verificar si está autenticado
    isAuthenticated() {
        return !!this.authToken && !!this.currentUser;
    }
};

// Exportar como objeto global
window.AuthService = AuthService;