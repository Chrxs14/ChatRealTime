const socketConfig = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    // Configuraciones adicionales para producción
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    maxHttpBufferSize: 1e6
};

module.exports = socketConfig;