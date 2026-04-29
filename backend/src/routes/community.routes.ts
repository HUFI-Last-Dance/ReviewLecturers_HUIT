import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate } from '../middleware/auth';
import * as reviewController from '../controllers/review.controller';
import * as replyController from '../controllers/reply.controller';
import * as voteController from '../controllers/vote.controller';

// ========================================
// 💬 REVIEW, REPLY & VOTE ROUTES
// ========================================

const router = Router();

// ========================================
// REVIEWS
// ========================================

/**
 * POST /api/community/reviews
 * Tạo review mới (yêu cầu đăng nhập)
 */
router.post('/reviews', authenticate, asyncHandler(reviewController.createReview));

/**
 * GET /api/community/reviews/recent
 * Lấy reviews mới nhất
 */
router.get('/reviews/recent', asyncHandler(reviewController.getRecentReviews));

/**
 * GET /api/community/reviews/me
 * Lấy danh sách review của tôi (đặt trước :id để không bị conflict)
 */
router.get('/reviews/me', authenticate, asyncHandler(reviewController.getMyReviews));

/**
 * GET /api/community/reviews/:id
 * Lấy chi tiết review
 */
router.get('/reviews/:id', asyncHandler(reviewController.getReviewById));

/**
 * PATCH /api/community/reviews/:id
 * Sửa review (chỉ author)
 */
router.patch('/reviews/:id', authenticate, asyncHandler(reviewController.updateReview));

/**
 * DELETE /api/community/reviews/:id
 * Xóa review (author hoặc admin)
 */
router.delete('/reviews/:id', authenticate, asyncHandler(reviewController.deleteReview));

// ========================================
// REPLIES
// ========================================

/**
 * POST /api/community/replies
 * Tạo reply (yêu cầu đăng nhập)
 */
router.post('/replies', authenticate, asyncHandler(replyController.createReply));

/**
 * GET /api/community/replies/:id
 * Lấy chi tiết reply
 */
router.get('/replies/:id', asyncHandler(replyController.getReplyById));

/**
 * PATCH /api/community/replies/:id
 * Sửa reply (chỉ author)
 */
router.patch('/replies/:id', authenticate, asyncHandler(replyController.updateReply));

/**
 * DELETE /api/community/replies/:id
 * Xóa reply (author hoặc admin)
 */
router.delete('/replies/:id', authenticate, asyncHandler(replyController.deleteReply));

// ========================================
// VOTES
// ========================================

/**
 * POST /api/community/votes/reviews/:reviewId
 * Vote cho review (upvote/downvote)
 */
router.post(
    '/votes/reviews/:reviewId',
    authenticate,
    asyncHandler(voteController.voteReview)
);

/**
 * POST /api/community/votes/replies/:replyId
 * Vote cho reply (upvote/downvote)
 */
router.post(
    '/votes/replies/:replyId',
    authenticate,
    asyncHandler(voteController.voteReply)
);

/**
 * GET /api/community/votes/reviews/:reviewId/my-vote
 * Lấy vote hiện tại của user cho review
 */
router.get(
    '/votes/reviews/:reviewId/my-vote',
    authenticate,
    asyncHandler(voteController.getMyReviewVote)
);

/**
 * GET /api/community/votes/replies/:replyId/my-vote
 * Lấy vote hiện tại của user cho reply
 */
router.get(
    '/votes/replies/:replyId/my-vote',
    authenticate,
    asyncHandler(voteController.getMyReplyVote)
);

export default router;
