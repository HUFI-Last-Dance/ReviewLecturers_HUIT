import { Request, Response } from 'express';
import { sendSuccess, sendNotFound } from '../utils/response';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';

// ========================================
// 🧪 EXAMPLE CONTROLLER
// ========================================
// Controller mẫu để test response helpers và error handling
// ========================================

/**
 * Test success response
 */
export const testSuccess = (req: Request, res: Response): void => {
    sendSuccess(res, { message: 'This is a test response' }, 'Test successful');
};

/**
 * Test error (AppError)
 */
export const testError = (req: Request, res: Response): void => {
    throw new AppError('This is a test error', 400);
};

/**
 * Test database connection
 */
export const testDatabase = async (req: Request, res: Response): Promise<void> => {
    try {
        // Test query đơn giản
        const result = await prisma.$queryRaw`SELECT 1 as test`;

        sendSuccess(res, {
            database: 'connected',
            result
        }, 'Database connection successful');
    } catch (error: any) {
        throw new AppError(`Database error: ${error.message}`, 500);
    }
};

/**
 * Test not found
 */
export const testNotFound = (req: Request, res: Response): void => {
    sendNotFound(res, 'Resource not found in test endpoint');
};
