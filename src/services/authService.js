const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const Logger = require('../utils/logger');

class AuthService {
    constructor() {
        this.usersFilePath = path.join(__dirname, '../../data/users.json');
        this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
        this.saltRounds = 10;
        this.users = new Map();
        this.loadUsers();
    }

    /**
     * Cargar usuarios desde archivo JSON
     */
    async loadUsers() {
        try {
            // Crear directorio data si no existe
            const dataDir = path.dirname(this.usersFilePath);
            await fs.mkdir(dataDir, { recursive: true });

            // Intentar cargar usuarios existentes
            const data = await fs.readFile(this.usersFilePath, 'utf8');
            const usersArray = JSON.parse(data);
            
            // Convertir array a Map para mejor rendimiento
            this.users = new Map(usersArray.map(user => [user.username, user]));
            
            Logger.info(`Cargados ${this.users.size} usuarios desde archivo`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                // Archivo no existe, crear uno vacío
                await this.saveUsers();
                Logger.info('Archivo de usuarios creado');
            } else {
                Logger.error('Error cargando usuarios:', error);
            }
        }
    }

    /**
     * Guardar usuarios en archivo JSON
     */
    async saveUsers() {
        try {
            const usersArray = Array.from(this.users.values());
            await fs.writeFile(this.usersFilePath, JSON.stringify(usersArray, null, 2));
            Logger.info('Usuarios guardados correctamente');
        } catch (error) {
            Logger.error('Error guardando usuarios:', error);
            throw error;
        }
    }

    /**
     * Registrar nuevo usuario
     * @param {string} username - Nombre de usuario
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Object} - Resultado del registro
     */
    async registerUser(username, email, password) {
        try {
            // Validar datos de entrada
            const validation = this.validateRegistrationData(username, email, password);
            if (!validation.valid) {
                return { success: false, error: validation.error };
            }

            // Verificar si el usuario ya existe
            if (this.users.has(username)) {
                return { success: false, error: 'El nombre de usuario ya está registrado' };
            }

            // Verificar si el email ya existe
            const emailExists = Array.from(this.users.values()).some(user => user.email === email);
            if (emailExists) {
                return { success: false, error: 'El email ya está registrado' };
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, this.saltRounds);

            // Crear objeto usuario
            const newUser = {
                username: username.trim(),
                email: email.toLowerCase().trim(),
                password: hashedPassword,
                createdAt: new Date(),
                lastLogin: null,
                isActive: true
            };

            // Guardar usuario
            this.users.set(username, newUser);
            await this.saveUsers();

            Logger.success(`Usuario registrado: ${username}`);
            
            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                user: {
                    username: newUser.username,
                    email: newUser.email,
                    createdAt: newUser.createdAt
                }
            };

        } catch (error) {
            Logger.error('Error en registro:', error);
            return { success: false, error: 'Error interno del servidor' };
        }
    }

    /**
     * Autenticar usuario (login)
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña
     * @returns {Object} - Resultado del login
     */
    async loginUser(username, password) {
        try {
            // Validar datos de entrada
            if (!username || !password) {
                return { success: false, error: 'Usuario y contraseña son requeridos' };
            }

            // Buscar usuario
            const user = this.users.get(username.trim());
            if (!user) {
                return { success: false, error: 'Usuario o contraseña incorrectos' };
            }

            // Verificar si el usuario está activo
            if (!user.isActive) {
                return { success: false, error: 'Cuenta desactivada' };
            }

            // Verificar contraseña
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { success: false, error: 'Usuario o contraseña incorrectos' };
            }

            // Actualizar último login
            user.lastLogin = new Date();
            await this.saveUsers();

            // Generar token JWT
            const token = jwt.sign(
                { 
                    username: user.username,
                    email: user.email,
                    loginTime: user.lastLogin
                },
                this.jwtSecret,
                { expiresIn: '24h' }
            );

            Logger.success(`Usuario autenticado: ${username}`);

            return {
                success: true,
                message: 'Login exitoso',
                user: {
                    username: user.username,
                    email: user.email,
                    lastLogin: user.lastLogin
                },
                token: token
            };

        } catch (error) {
            Logger.error('Error en login:', error);
            return { success: false, error: 'Error interno del servidor' };
        }
    }

    /**
     * Verificar token JWT
     * @param {string} token - Token a verificar
     * @returns {Object} - Resultado de la verificación
     */
    verifyToken(token) {
        try {
            const decoded = jwt.verify(token, this.jwtSecret);
            const user = this.users.get(decoded.username);
            
            if (!user || !user.isActive) {
                return { valid: false, error: 'Token inválido o usuario inactivo' };
            }

            return {
                valid: true,
                user: {
                    username: user.username,
                    email: user.email,
                    lastLogin: user.lastLogin
                }
            };
        } catch (error) {
            return { valid: false, error: 'Token inválido o expirado' };
        }
    }

    /**
     * Validar datos de registro
     * @param {string} username - Nombre de usuario
     * @param {string} email - Email
     * @param {string} password - Contraseña
     * @returns {Object} - Resultado de validación
     */
    validateRegistrationData(username, email, password) {
        // Validar username
        if (!username || username.trim().length < 3) {
            return { valid: false, error: 'El nombre de usuario debe tener al menos 3 caracteres' };
        }
        if (username.trim().length > 20) {
            return { valid: false, error: 'El nombre de usuario no puede tener más de 20 caracteres' };
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
            return { valid: false, error: 'El nombre de usuario solo puede contener letras, números y guiones bajos' };
        }

        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return { valid: false, error: 'Email inválido' };
        }

        // Validar contraseña
        if (!password || password.length < 6) {
            return { valid: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        if (password.length > 100) {
            return { valid: false, error: 'La contraseña es demasiado larga' };
        }

        return { valid: true };
    }

    /**
     * Obtener información de usuario (sin contraseña)
     * @param {string} username - Nombre de usuario
     * @returns {Object|null} - Información del usuario
     */
    getUserInfo(username) {
        const user = this.users.get(username);
        if (!user) return null;

        return {
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
            isActive: user.isActive
        };
    }

    /**
     * Obtener estadísticas de usuarios
     * @returns {Object} - Estadísticas
     */
    getStats() {
        const totalUsers = this.users.size;
        const activeUsers = Array.from(this.users.values()).filter(user => user.isActive).length;
        
        return {
            totalUsers,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers
        };
    }
}

module.exports = AuthService;