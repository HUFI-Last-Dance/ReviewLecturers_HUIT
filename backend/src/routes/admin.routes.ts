import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, requireRole } from '../middleware/auth';
import * as adminController from '../controllers/admin.controller';
import * as bulkController from '../controllers/bulk.controller';

// ========================================
// 👑 ADMIN ROUTES (Admin only)
// ========================================

const router = Router();

// Tất cả routes dưới đây yêu cầu:
// 1. Đăng nhập (authenticate)
// 2. Có role "admin" (requireRole)

// ========================================
// 📊 STATS & DASHBOARD
// ========================================

/**
 * GET /api/admin/stats
 * Lấy thống kê hệ thống
 */
router.get(
    '/stats',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.getSystemStats)
);

// ========================================
// 🛡️ CONTENT MODERATION
// ========================================

/**
 * GET /api/admin/reviews
 * Lấy danh sách tất cả reviews
 */
router.get(
    '/reviews',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.getAllReviews)
);

// ========================================
// 👤 USER MANAGEMENT
// ========================================

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả users
 * Query params: ?page=1&limit=20
 */
router.get(
    '/users',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.getAllUsers)
);

/**
 * GET /api/admin/users/:id
 * Lấy chi tiết một user
 */
router.get(
    '/users/:id',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.getUserById)
);

// ========================================
// 🔐 ROLE MANAGEMENT
// ========================================

/**
 * POST /api/admin/users/:id/roles
 * Gán role cho user
 * 
 * Body: { "roleName": "lecturer" }
 */
router.post(
    '/users/:id/roles',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.assignRole)
);

/**
 * DELETE /api/admin/users/:id/roles/:roleName
 * Xóa role khỏi user
 */
router.delete(
    '/users/:id/roles/:roleName',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.removeRole)
);

// ========================================
// ✅ VERIFY LECTURER
// ========================================

/**
 * GET /api/admin/lecturers/unlinked
 * Lấy danh sách giảng viên chưa liên kết với user
 */
router.get(
    '/lecturers/unlinked',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.getUnlinkedLecturers)
);

/**
 * POST /api/admin/lecturers/:lecturerId/verify
 * Verify lecturer (liên kết với user)
 * 
 * Body: { "userId": "uuid" }
 */
router.post(
    '/lecturers/:lecturerId/verify',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.verifyLecturer)
);

/**
 * POST /api/admin/lecturers/:lecturerId/unverify
 * Hủy verify lecturer
 */
router.post(
    '/lecturers/:lecturerId/unverify',
    authenticate,
    requireRole(['admin']),
    asyncHandler(adminController.unverifyLecturer)
);

// ========================================
// 📥 BULK IMPORT (For N8N)
// ========================================

/**
 * POST /api/admin/bulk/lecturers
 * Bulk import lecturers
 */
router.post(
    '/bulk/lecturers',
    authenticate,
    requireRole(['admin']),
    asyncHandler(bulkController.bulkImportLecturers)
);

/**
 * POST /api/admin/bulk/subjects
 * Bulk import subjects
 */
router.post(
    '/bulk/subjects',
    authenticate,
    requireRole(['admin']),
    asyncHandler(bulkController.bulkImportSubjects)
);

/**
 * POST /api/admin/bulk/terms
 * Bulk import academic terms
 */
router.post(
    '/bulk/terms',
    authenticate,
    requireRole(['admin']),
    asyncHandler(bulkController.bulkImportTerms)
);

/**
 * POST /api/admin/bulk/assignments
 * Bulk import teaching assignments
 */
router.post(
    '/bulk/assignments',
    authenticate,
    requireRole(['admin']),
    asyncHandler(bulkController.bulkImportAssignments)
);

export default router;
