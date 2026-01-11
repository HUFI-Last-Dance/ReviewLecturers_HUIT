import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as assignmentController from '../controllers/assignment.controller';

// ========================================
// 📋 TEACHING ASSIGNMENT ROUTES (Public)
// ========================================

const router = Router();

/**
 * GET /api/assignments
 * Lấy danh sách teaching assignments
 * Query params: ?lecturerId=xxx&subjectId=xxx&termId=xxx&page=1&limit=20
 */
router.get('/', asyncHandler(assignmentController.getAllAssignments));

/**
 * GET /api/assignments/:id
 * Lấy chi tiết teaching assignment (bao gồm reviews)
 */
router.get('/:id', asyncHandler(assignmentController.getAssignmentById));

export default router;
