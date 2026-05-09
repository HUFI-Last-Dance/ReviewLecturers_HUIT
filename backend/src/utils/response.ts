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
export interface SuccessResponse<T = unknown> {
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
  errors?: unknown[];
}

/**
 * Helper: Success response (200, 201, etc)
 */
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = 200,
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message: message || 'Success',
    data,
  };

  res.status(statusCode).json(response);
};

/**
 * Helper: Error response
 */
export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: unknown[],
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
  message: string = 'Resource created successfully',
): void => {
  sendSuccess(res, data, message, 201);
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import { sendSuccess, sendError, sendCreated } from '@/utils/response';
//
// // Success với data
// sendSuccess(res, user, 'User fetched successfully');
//
// // Created
// sendCreated(res, newUser, 'User created');
//
// // Error
// sendError(res, 'Error message', 404);
// ========================================
