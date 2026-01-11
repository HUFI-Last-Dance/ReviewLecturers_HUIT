import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import * as testController from '../controllers/test.controller';

// ========================================
// 🧪 TEST ROUTES
// ========================================
// Routes để test response helpers và error handling
// ========================================

const router = Router();

/**
 * GET /api/test/success
 * Test success response
 */
router.get('/success', testController.testSuccess);

/**
 * GET /api/test/error
 * Test error handling
 */
router.get('/error', testController.testError);

/**
 * GET /api/test/database
 * Test database connection
 */
router.get('/database', asyncHandler(testController.testDatabase));

/**
 * GET /api/test/not-found
 * Test 404 response
 */
router.get('/not-found', testController.testNotFound);

export default router;
