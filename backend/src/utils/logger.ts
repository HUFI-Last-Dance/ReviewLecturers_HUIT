// ========================================
// 📝 LOGGER UTILITY
// ========================================
// Simple logger - có thể thay bằng Winston/Pino sau
// ========================================

type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

interface LogOptions {
    level: LogLevel;
    message: string;
    data?: any;
}

class Logger {
    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getColorCode(level: LogLevel): string {
        const colors = {
            info: '\x1b[36m',    // Cyan
            warn: '\x1b[33m',    // Yellow
            error: '\x1b[31m',   // Red
            debug: '\x1b[35m',   // Magenta
            success: '\x1b[32m', // Green
        };
        return colors[level] || '\x1b[0m';
    }

    private getEmoji(level: LogLevel): string {
        const emojis = {
            info: 'ℹ️',
            warn: '⚠️',
            error: '❌',
            debug: '🔍',
            success: '✅',
        };
        return emojis[level] || '•';
    }

    private log(options: LogOptions): void {
        const { level, message, data } = options;
        const timestamp = this.getTimestamp();
        const colorCode = this.getColorCode(level);
        const resetCode = '\x1b[0m';
        const emoji = this.getEmoji(level);

        // Format: [timestamp] EMOJI LEVEL: message
        const logMessage = `${colorCode}[${timestamp}] ${emoji} ${level.toUpperCase()}: ${message}${resetCode}`;

        console.log(logMessage);

        // Nếu có data, log riêng
        if (data !== undefined) {
            console.log(`${colorCode}Data:${resetCode}`, data);
        }
    }

    public info(message: string, data?: any): void {
        this.log({ level: 'info', message, data });
    }

    public warn(message: string, data?: any): void {
        this.log({ level: 'warn', message, data });
    }

    public error(message: string, data?: any): void {
        this.log({ level: 'error', message, data });
    }

    public debug(message: string, data?: any): void {
        if (process.env.NODE_ENV === 'development') {
            this.log({ level: 'debug', message, data });
        }
    }

    public success(message: string, data?: any): void {
        this.log({ level: 'success', message, data });
    }

    // Request logger
    public request(method: string, url: string, statusCode?: number): void {
        const emoji = statusCode && statusCode >= 400 ? '❌' : '✅';
        const message = `${emoji} ${method} ${url}${statusCode ? ` - ${statusCode}` : ''}`;
        this.info(message);
    }
}

// Singleton instance
const logger = new Logger();

export default logger;

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import logger from '@/utils/logger';
//
// logger.info('Server started successfully');
// logger.warn('Database connection slow');
// logger.error('Failed to connect', { error: err.message });
// logger.debug('Debug info', { userId: 123 });
// logger.success('User created successfully', { userId: newUser.id });
// logger.request('GET', '/api/users', 200);
// ========================================
