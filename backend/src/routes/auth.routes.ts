import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/auth.controller';

// ========================================
// 🔐 AUTH ROUTES
// ========================================

const router = Router();

/**
 * POST /api/auth/register
 * Đăng ký user mới
 * 
 * Body:
 * {
 *   "email": "student@example.com",
 *   "password": "password123",
 *   "fullName": "Nguyễn Văn A",
 *   "studentId": "SV001" (optional)
 * }
 */
router.post('/register', asyncHandler(authController.register));

/**
 * POST /api/auth/login
 * Đăng nhập
 * 
 * Body:
 * {
 *   "email": "student@example.com",
 *   "password": "password123"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "data": {
 *     "user": { ... },
 *     "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
router.post('/login', asyncHandler(authController.login));

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (yêu cầu đăng nhập)
 * 
 * Headers:
 * Authorization: Bearer <token>
 */
router.get('/me', authenticate, asyncHandler(authController.getMe));

/**
 * PUT /api/auth/profile
 * Cập nhật thông tin profile (fullName, studentId)
 * Có cooldown 3 ngày giữa các lần cập nhật
 * 
 * Headers:
 * Authorization: Bearer <token>
 * 
 * Body:
 * {
 *   "fullName": "Họ tên mới",
 *   "studentId": "MSSV123" (optional)
 * }
 */
router.put('/profile', authenticate, asyncHandler(authController.updateProfile));

export default router;
