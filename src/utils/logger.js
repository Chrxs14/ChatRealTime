class Logger {
    static info(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ℹ️  INFO: ${message}`, data ? data : '');
    }

    static error(message, error = null) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ❌ ERROR: ${message}`, error ? error : '');
    }

    static warn(message, data = null) {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] ⚠️  WARN: ${message}`, data ? data : '');
    }

    static success(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ✅ SUCCESS: ${message}`, data ? data : '');
    }

    static connection(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 🔌 CONNECTION: ${message}`, data ? data : '');
    }

    static message(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 💬 MESSAGE: ${message}`, data ? data : '');
    }

    static server(message, data = null) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] 🚀 SERVER: ${message}`, data ? data : '');
    }
}

module.exports = Logger;