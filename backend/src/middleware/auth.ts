import { Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { verifyToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../types/auth.types';

// ========================================
// 🛡️ AUTH MIDDLEWARE
// ========================================

/**
 * Middleware để bảo vệ routes (yêu cầu đăng nhập)
 * Sử dụng: router.get('/protected', authenticate, controller)
 */
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    // 1. Lấy token từ header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Không tìm thấy token xác thực', 401);
    }

    // 2. Extract token (loại bỏ "Bearer ")
    const token = authHeader.substring(7);

    // 3. Verify token
    try {
      const payload = verifyToken(token);

      // 4. Gắn user info vào request
      req.user = payload;

      // 5. Tiếp tục
      next();
    } catch (error: unknown) {
      throw new AppError((error as Error).message || 'Token không hợp lệ', 401);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware để kiểm tra role (dùng sau authenticate)
 * Sử dụng: router.get('/admin', authenticate, requireRole(['admin']), controller)
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
      // Kiểm tra xem user đã được authenticate chưa
      if (!req.user) {
        throw new AppError('Unauthorized', 401);
      }

      // Kiểm tra xem user có role được phép không
      const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

      if (!hasRole) {
        throw new AppError('Bạn không có quyền truy cập', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import { authenticate, requireRole } from '@/middleware/auth';
//
// // Route yêu cầu đăng nhập
// router.get('/profile', authenticate, getProfile);
//
// // Route chỉ admin mới truy cập được
// router.get('/admin/users', authenticate, requireRole(['admin']), getAllUsers);
//
// // Route admin hoặc lecturer mới truy cập được
// router.get('/manage', authenticate, requireRole(['admin', 'lecturer']), manage);
// ========================================
