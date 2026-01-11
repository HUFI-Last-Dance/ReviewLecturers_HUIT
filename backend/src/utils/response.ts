import { Response } from 'express';

// ========================================
// 📤 RESPONSE HELPERS
// ========================================
// Mục đích: Chuẩn hóa format response API
// Lợi ích:
// - Frontend biết chính xác structure
// - Dễ debug, dễ maintain
// - Consistent across all endpoints
// ========================================

/**
 * Interface cho Success Response
 */
export interface SuccessResponse<T = any> {
    success: true;
    message?: string;
    data?: T;
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

/**
 * Interface cho Error Response
 */
export interface ErrorResponse {
    success: false;
    message: string;
    errors?: any[];
    stack?: string; // Chỉ hiển thị trong development
}

/**
 * Helper: Success response (200, 201, etc)
 */
export const sendSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
): void => {
    const response: SuccessResponse<T> = {
        success: true,
        message: message || 'Success',
        data,
    };

    res.status(statusCode).json(response);
};

/**
 * Helper: Success response with pagination
 */
export const sendSuccessWithPagination = <T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
): void => {
    const totalPages = Math.ceil(total / limit);

    const response: SuccessResponse<T[]> = {
        success: true,
        message: message || 'Success',
        data,
        meta: {
            page,
            limit,
            total,
            totalPages,
        },
    };

    res.status(200).json(response);
};

/**
 * Helper: Error response
 */
export const sendError = (
    res: Response,
    message: string,
    statusCode: number = 500,
    errors?: any[]
): void => {
    const response: ErrorResponse = {
        success: false,
        message,
        errors,
    };

    res.status(statusCode).json(response);
};

/**
 * Helper: Created response (201)
 */
export const sendCreated = <T>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
): void => {
    sendSuccess(res, data, message, 201);
};

/**
 * Helper: No content response (204)
 */
export const sendNoContent = (res: Response): void => {
    res.status(204).send();
};

/**
 * Helper: Bad request (400)
 */
export const sendBadRequest = (
    res: Response,
    message: string = 'Bad request',
    errors?: any[]
): void => {
    sendError(res, message, 400, errors);
};

/**
 * Helper: Unauthorized (401)
 */
export const sendUnauthorized = (
    res: Response,
    message: string = 'Unauthorized'
): void => {
    sendError(res, message, 401);
};

/**
 * Helper: Forbidden (403)
 */
export const sendForbidden = (
    res: Response,
    message: string = 'Forbidden'
): void => {
    sendError(res, message, 403);
};

/**
 * Helper: Not found (404)
 */
export const sendNotFound = (
    res: Response,
    message: string = 'Resource not found'
): void => {
    sendError(res, message, 404);
};

/**
 * Helper: Conflict (409)
 */
export const sendConflict = (
    res: Response,
    message: string = 'Resource already exists'
): void => {
    sendError(res, message, 409);
};

/**
 * Helper: Internal server error (500)
 */
export const sendInternalError = (
    res: Response,
    message: string = 'Internal server error'
): void => {
    sendError(res, message, 500);
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import { sendSuccess, sendError, sendNotFound } from '@/utils/response';
//
// // Success với data
// sendSuccess(res, user, 'User fetched successfully');
//
// // Success với pagination
// sendSuccessWithPagination(res, users, page, limit, total);
//
// // Created
// sendCreated(res, newUser, 'User created');
//
// // Error
// sendNotFound(res, 'User not found');
// sendBadRequest(res, 'Invalid input', validationErrors);
// ========================================
