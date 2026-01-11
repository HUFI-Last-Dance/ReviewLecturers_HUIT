import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';
import logger from '../utils/logger';

// ========================================
// 💬 REPLY CONTROLLER (Tree Structure)
// ========================================
// Reply có thể lồng nhau không giới hạn (parent → child → grandchild...)
// ========================================

/**
 * POST /api/replies
 * Tạo reply (yêu cầu đăng nhập)
 * 
 * Body: {
 *   reviewId: "uuid",
 *   parentId: "uuid" | null,  // null = reply trực tiếp review
 *   content: "Tôi đồng ý với bạn..."
 * }
 */
export const createReply = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { reviewId, parentId, content } = req.body;
    const userId = req.user!.userId;

    // Validate
    if (!reviewId || !content) {
        throw new AppError('reviewId và content là bắt buộc', 400);
    }

    if (content.length < 2) {
        throw new AppError('Nội dung phải có ít nhất 2 ký tự', 400);
    }

    // Check review exists
    const review = await prisma.review.findUnique({
        where: { id: reviewId },
    });

    if (!review) {
        throw new AppError('Review không tồn tại', 404);
    }

    // If parentId provided, check it exists và thuộc về review này
    if (parentId) {
        const parentReply = await prisma.reviewReply.findUnique({
            where: { id: parentId },
        });

        if (!parentReply) {
            throw new AppError('Parent reply không tồn tại', 404);
        }

        if (parentReply.reviewId !== reviewId) {
            throw new AppError('Parent reply không thuộc về review này', 400);
        }
    }

    // Create reply
    const reply = await prisma.reviewReply.create({
        data: {
            userId,
            reviewId,
            parentId: parentId || null,
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                },
            },
        },
    });

    logger.success(`User ${userId} created reply for review ${reviewId}`);

    const response = {
        ...reply,
        author: {
            id: reply.user.id,
            fullName: reply.user.fullName,
            roles: reply.user.userRoles.map((ur) => ur.role.name),
        },
    };

    sendCreated(res, response, 'Tạo reply thành công');
};

/**
 * GET /api/replies/:id
 * Lấy chi tiết reply + nested replies
 */
export const getReplyById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const reply = await prisma.reviewReply.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    fullName: true,
                    userRoles: {
                        include: {
                            role: true,
                        },
                    },
                },
            },
            replies: {
                // Nested replies (children)
                include: {
                    user: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                    replies: {
                        // Grandchildren
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    fullName: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            },
        },
    });

    if (!reply) {
        throw new AppError('Reply không tồn tại', 404);
    }

    const response = {
        ...reply,
        author: {
            id: reply.user.id,
            fullName: reply.user.fullName,
            roles: reply.user.userRoles.map((ur) => ur.role.name),
        },
    };

    sendSuccess(res, response, 'Lấy reply thành công');
};

/**
 * PATCH /api/replies/:id
 * Sửa reply (chỉ author)
 */
export const updateReply = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    if (!content || content.length < 2) {
        throw new AppError('Nội dung phải có ít nhất 2 ký tự', 400);
    }

    const reply = await prisma.reviewReply.findUnique({
        where: { id },
    });

    if (!reply) {
        throw new AppError('Reply không tồn tại', 404);
    }

    if (reply.userId !== userId) {
        throw new AppError('Bạn không có quyền sửa reply này', 403);
    }

    const updated = await prisma.reviewReply.update({
        where: { id },
        data: { content },
    });

    logger.info(`User ${userId} updated reply ${id}`);
    sendSuccess(res, updated, 'Cập nhật reply thành công');
};

/**
 * DELETE /api/replies/:id
 * Xóa reply (chỉ author hoặc admin)
 */
export const deleteReply = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    const userId = req.user!.userId;
    const roles = req.user!.roles;

    const reply = await prisma.reviewReply.findUnique({
        where: { id },
    });

    if (!reply) {
        throw new AppError('Reply không tồn tại', 404);
    }

    if (reply.userId !== userId && !roles.includes('admin')) {
        throw new AppError('Bạn không có quyền xóa reply này', 403);
    }

    await prisma.reviewReply.delete({
        where: { id },
    });

    logger.warn(`Reply ${id} deleted by user ${userId}`);
    sendSuccess(res, null, 'Xóa reply thành công');
};
