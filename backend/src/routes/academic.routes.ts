import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as academicController from '../controllers/academic.controller';

// ========================================
// 📚 SUBJECT & TERM ROUTES (Public)
// ========================================

const router = Router();

// ========================================
// SUBJECTS
// ========================================

/**
 * GET /api/academic/subjects
 * Lấy danh sách môn học
 */
router.get('/subjects', asyncHandler(academicController.getAllSubjects));

/**
 * GET /api/academic/subjects/:id
 * Lấy chi tiết môn học
 */
router.get('/subjects/:id', asyncHandler(academicController.getSubjectById));

// ========================================
// TERMS
// ========================================

/**
 * GET /api/academic/terms
 * Lấy danh sách học kỳ
 */
router.get('/terms', asyncHandler(academicController.getAllTerms));

/**
 * GET /api/academic/terms/:id
 * Lấy chi tiết học kỳ
 */
router.get('/terms/:id', asyncHandler(academicController.getTermById));

export default router;
