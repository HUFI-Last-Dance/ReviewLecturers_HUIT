import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';
import logger from '../utils/logger';

// ========================================
// 👍 VOTE CONTROLLER (Upvote/Downvote)
// ========================================

/**
 * POST /api/votes/reviews/:reviewId
 * Vote cho review
 * 
 * Body: { voteType: "UPVOTE" | "DOWNVOTE" }
 */
export const voteReview = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { reviewId } = req.params;
    const { voteType } = req.body;
    const userId = req.user!.userId;

    // Validate
    if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
        throw new AppError('voteType phải là UPVOTE hoặc DOWNVOTE', 400);
    }

    // Check review exists
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError('Review không tồn tại', 404);
    }

    // Check existing vote
    const existingVote = await prisma.reviewVote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId,
            },
        },
    });

    let action: 'created' | 'updated' | 'deleted' = 'created';

    if (existingVote) {
        // Nếu vote giống nhau → Xóa vote (toggle)
        if (existingVote.voteType === voteType) {
            await prisma.reviewVote.delete({
                where: { id: existingVote.id },
            });
            action = 'deleted';
        } else {
            // Nếu vote khác → Update
            await prisma.reviewVote.update({
                where: { id: existingVote.id },
                data: { voteType },
            });
            action = 'updated';
        }
    } else {
        // Chưa vote → Tạo mới
        await prisma.reviewVote.create({
            data: {
                userId,
                reviewId,
                voteType,
            },
        });
    }

    // Recalculate vote counts
    const [upvotes, downvotes] = await Promise.all([
        prisma.reviewVote.count({
            where: { reviewId, voteType: 'UPVOTE' },
        }),
        prisma.reviewVote.count({
            where: { reviewId, voteType: 'DOWNVOTE' },
        }),
    ]);

    // Update review counts
    await prisma.review.update({
        where: { id: reviewId },
        data: {
            upvoteCount: upvotes,
            downvoteCount: downvotes,
        },
    });

    logger.info(`User ${userId} ${action} ${voteType} on review ${reviewId}`);

    sendSuccess(
        res,
        {
            action,
            upvoteCount: upvotes,
            downvoteCount: downvotes,
        },
        'Vote thành công'
    );
};

/**
 * POST /api/votes/replies/:replyId
 * Vote cho reply
 * 
 * Body: { voteType: "UPVOTE" | "DOWNVOTE" }
 */
export const voteReply = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { replyId } = req.params;
    const { voteType } = req.body;
    const userId = req.user!.userId;

    if (!voteType || !['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
        throw new AppError('voteType phải là UPVOTE hoặc DOWNVOTE', 400);
    }

    const reply = await prisma.reviewReply.findUnique({
        where: { id: replyId },
    });

    if (!reply) {
        throw new AppError('Reply không tồn tại', 404);
    }

    const existingVote = await prisma.replyVote.findUnique({
        where: {
            userId_replyId: {
                userId,
                replyId,
            },
        },
    });

    let action: 'created' | 'updated' | 'deleted' = 'created';

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            await prisma.replyVote.delete({
                where: { id: existingVote.id },
            });
            action = 'deleted';
        } else {
            await prisma.replyVote.update({
                where: { id: existingVote.id },
                data: { voteType },
            });
            action = 'updated';
        }
    } else {
        await prisma.replyVote.create({
            data: {
                userId,
                replyId,
                voteType,
            },
        });
    }

    // Recalculate
    const [upvotes, downvotes] = await Promise.all([
        prisma.replyVote.count({
            where: { replyId, voteType: 'UPVOTE' },
        }),
        prisma.replyVote.count({
            where: { replyId, voteType: 'DOWNVOTE' },
        }),
    ]);

    await prisma.reviewReply.update({
        where: { id: replyId },
        data: {
            upvoteCount: upvotes,
            downvoteCount: downvotes,
        },
    });

    logger.info(`User ${userId} ${action} ${voteType} on reply ${replyId}`);

    sendSuccess(
        res,
        {
            action,
            upvoteCount: upvotes,
            downvoteCount: downvotes,
        },
        'Vote thành công'
    );
};

/**
 * GET /api/votes/reviews/:reviewId/my-vote
 * Lấy vote hiện tại của user cho review
 */
export const getMyReviewVote = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { reviewId } = req.params;
    const userId = req.user!.userId;

    const vote = await prisma.reviewVote.findUnique({
        where: {
            userId_reviewId: {
                userId,
                reviewId,
            },
        },
    });

    sendSuccess(
        res,
        {
            voteType: vote?.voteType || null,
        },
        'Lấy vote thành công'
    );
};

/**
 * GET /api/votes/replies/:replyId/my-vote
 * Lấy vote hiện tại của user cho reply
 */
export const getMyReplyVote = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { replyId } = req.params;
    const userId = req.user!.userId;

    const vote = await prisma.replyVote.findUnique({
        where: {
            userId_replyId: {
                userId,
                replyId,
            },
        },
    });

    sendSuccess(
        res,
        {
            voteType: vote?.voteType || null,
        },
        'Lấy vote thành công'
    );
};
