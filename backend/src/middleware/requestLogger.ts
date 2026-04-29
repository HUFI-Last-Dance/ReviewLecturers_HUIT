import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// ========================================
// 📊 REQUEST LOGGER MIDDLEWARE
// ========================================
// Log mọi request vào API
// ========================================

export const requestLogger = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const startTime = Date.now();

    // Log khi response kết thúc
    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const { method, originalUrl } = req;
        const { statusCode } = res;

        // Chọn emoji dựa trên status code
        let emoji = '✅';
        if (statusCode >= 500) emoji = '❌';
        else if (statusCode >= 400) emoji = '⚠️';
        else if (statusCode >= 300) emoji = '🔄';

        // Log message
        const message = `${emoji} ${method} ${originalUrl} - ${statusCode} (${duration}ms)`;

        if (statusCode >= 400) {
            logger.warn(message);
        } else {
            logger.info(message);
        }
    });

    next();
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// // Trong index.ts, thêm middleware:
// import { requestLogger } from './middleware/requestLogger';
// app.use(requestLogger);
// ========================================
