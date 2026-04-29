import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/response';

// ========================================
// ⚠️ CUSTOM ERROR CLASS
// ========================================

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Để phân biệt lỗi mong đợi vs lỗi unexpected

    Error.captureStackTrace(this, this.constructor);
  }
}

// ========================================
// 🛡️ ERROR HANDLER MIDDLEWARE
// ========================================

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Nếu là AppError (lỗi mong đợi)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } else {
    // Lỗi không mong đợi
    message = err.message || message;
  }

  // Log error (trong production nên dùng logger như Winston)
  console.error('❌ Error:', {
    message: err.message,
    statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    isOperational,
    url: req.originalUrl,
    method: req.method,
  });

  // Response
  const response: ErrorResponse = {
    success: false,
    message,
  };

  res.status(statusCode).json(response);
};

// ========================================
// 🚫 NOT FOUND HANDLER (404)
// ========================================

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new AppError(`Route not found: ${req.originalUrl}`, 404);
  next(error);
};

// ========================================
// 🔄 ASYNC HANDLER WRAPPER
// ========================================
// Tự động catch lỗi trong async functions, không cần try-catch

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
//
// // 1. Trong routes/controllers:
// throw new AppError('User not found', 404);
// throw new AppError('Unauthorized', 401);
//
// // 2. Wrap async functions:
// router.get('/users', asyncHandler(async (req, res) => {
//   const users = await prisma.user.findMany();
//   sendSuccess(res, users);
// }));
//
// // 3. Trong index.ts (cuối cùng):
// app.use(notFoundHandler);
// app.use(errorHandler);
// ========================================
