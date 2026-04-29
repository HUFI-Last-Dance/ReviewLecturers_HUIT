import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as lecturerController from '../controllers/lecturer.controller';

// ========================================
// 👨‍🏫 LECTURER ROUTES (Public)
// ========================================

const router = Router();

/**
 * GET /api/lecturers
 * Lấy danh sách giảng viên
 * Query params: ?page=1&limit=20
 */
router.get('/', asyncHandler(lecturerController.getAllLecturers));

/**
 * GET /api/lecturers/:id
 * Lấy chi tiết giảng viên
 */
router.get('/:id', asyncHandler(lecturerController.getLecturerById));

/**
 * POST /api/lecturers/:id/vote
 * Vote giảng viên (Up/Down)
 */
import { authenticate } from '../middleware/auth';
router.post('/:id/vote', authenticate, asyncHandler(lecturerController.voteLecturer));

export default router;
