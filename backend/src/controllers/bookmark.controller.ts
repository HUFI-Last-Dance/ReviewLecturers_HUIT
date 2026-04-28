
import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';

// ========================================
// 🔖 BOOKMARK CONTROLLER
// ========================================

/**
 * POST /api/bookmarks/lecturers/:id
 * Toggle bookmark (Lưu/Hủy lưu)
 */
export const toggleBookmark = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id: lecturerId } = req.params;
    const userId = req.user!.userId;

    // 1. Check lecturer exist
    const lecturer = await prisma.lecturer.findUnique({
        where: { id: lecturerId as string },
    });

    if (!lecturer) {
        throw new AppError('Giảng viên không tồn tại', 404);
    }

    // 2. Check existing bookmark
    const existingBookmark = await prisma.lecturerBookmark.findUnique({
        where: {
            userId_lecturerId: {
                userId,
                lecturerId: lecturerId as string,
            },
        },
    });

    if (existingBookmark) {
        // Remove bookmark
        await prisma.lecturerBookmark.delete({
            where: { id: existingBookmark.id },
        });

        sendSuccess(res, { bookmarked: false }, 'Đã hủy lưu giảng viên');
    } else {
        // Add bookmark
        await prisma.lecturerBookmark.create({
            data: {
                userId,
                lecturerId: lecturerId as string,
            },
        });

        sendCreated(res, { bookmarked: true }, 'Đã lưu giảng viên');
    }
};

/**
 * GET /api/bookmarks/lecturers
 * Lấy danh sách giảng viên đã lưu
 */
export const getMyBookmarks = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const userId = req.user!.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [bookmarks, total] = await Promise.all([
        prisma.lecturerBookmark.findMany({
            where: { userId },
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                lecturer: {
                    select: {
                        id: true,
                        fullName: true,
                        staffId: true,
                        cleanName: true,
                        engagementScore: true,
                        totalReviews: true,
                        totalReviewVotes: true,
                        upvoteCount: true,
                        downvoteCount: true,
                        degree: { select: { code: true, name: true } },
                    }
                }
            }
        }),
        prisma.lecturerBookmark.count({ where: { userId } }),
    ]);

    const formattedBookmarks = bookmarks.map(b => ({
        ...b.lecturer,
        bookmarkedAt: b.createdAt,
        totalVotes: b.lecturer.upvoteCount + b.lecturer.downvoteCount,
        reviewsCount: b.lecturer.totalReviews,
    }));

    sendSuccess(res, {
        lecturers: formattedBookmarks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, 'Lấy danh sách bookmark thành công');
};
