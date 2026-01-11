import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';
import logger from '../utils/logger';

// ========================================
// 📊 DASHBOARD STATS (Admin only)
// ========================================

/**
 * GET /api/admin/stats
 * Lấy thống kê tổng quan hệ thống
 */
export const getSystemStats = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const [
        totalUsers,
        totalLecturers,
        totalSubjects,
        totalReviews,
        totalReplies,
        pendingLecturers
    ] = await Promise.all([
        prisma.user.count(),
        prisma.lecturer.count(),
        prisma.subject.count(),
        prisma.review.count(),
        prisma.reviewReply.count(),
        prisma.lecturer.count({ where: { userId: null } })
    ]);

    const stats = {
        users: totalUsers,
        lecturers: totalLecturers,
        subjects: totalSubjects,
        content: {
            reviews: totalReviews,
            replies: totalReplies,
            totalInteractions: totalReviews + totalReplies
        },
        pending: {
            unlinkedLecturers: pendingLecturers
        }
    };

    sendSuccess(res, stats, 'Lấy thống kê hệ thống thành công');
};

// ========================================
// 🛡️ CONTENT MODERATION (Review Management)
// ========================================

/**
 * GET /api/admin/reviews
 * Lấy danh sách tất cả reviews (để duyệt)
 * Query: ?page=1&limit=20&reported=true (future)
 */
export const getAllReviews = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
        prisma.review.findMany({
            skip,
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true
                    },
                },
                teachingAssignment: {
                    select: {
                        id: true,
                        lecturer: { select: { fullName: true } },
                        subject: { select: { code: true, name: true } }
                    }
                },
                _count: {
                    select: {
                        replies: true,
                        votes: true // ReviewVote
                    }
                }
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.review.count(),
    ]);

    const formattedReviews = reviews.map((review) => ({
        id: review.id,
        content: review.content,
        author: review.user,
        target: {
            lecturer: review.teachingAssignment.lecturer.fullName,
            subject: `${review.teachingAssignment.subject.code} - ${review.teachingAssignment.subject.name}`
        },
        stats: {
            upvotes: review.upvoteCount,
            downvotes: review.downvoteCount,
            replies: review._count.replies
        },
        isAnonymous: review.isAnonymous,
        createdAt: review.createdAt,
    }));

    sendSuccess(res, {
        reviews: formattedReviews,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    }, 'Lấy danh sách reviews thành công');
};

// ========================================
// 👤 USER MANAGEMENT (Admin only)
// ========================================

/**
 * GET /api/admin/users
 * Lấy danh sách tất cả users (có pagination)
 */
export const getAllUsers = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                email: true,
                fullName: true,
                studentId: true,
                createdAt: true,
                updatedAt: true,
                userRoles: {
                    include: {
                        role: true,
                    },
                },
                lecturer: {
                    select: {
                        id: true,
                        staffId: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.user.count(),
    ]);

    // Transform data
    const usersWithRoles = users.map((user) => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        studentId: user.studentId,
        roles: user.userRoles.map((ur) => ur.role.name),
        lecturer: user.lecturer
            ? {
                id: user.lecturer.id,
                staffId: user.lecturer.staffId,
            }
            : null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    }));

    const response = {
        users: usersWithRoles,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    sendSuccess(res, response, 'Lấy danh sách users thành công');
};

/**
 * GET /api/admin/users/:id
 * Lấy chi tiết một user
 */
export const getUserById = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            email: true,
            fullName: true,
            studentId: true,
            createdAt: true,
            updatedAt: true,
            userRoles: {
                include: {
                    role: true,
                },
            },
            lecturer: {
                select: {
                    id: true,
                    fullName: true,
                    staffId: true,
                    email: true,
                },
            },
        },
    });

    if (!user) {
        throw new AppError('User không tồn tại', 404);
    }

    const userWithRoles = {
        ...user,
        roles: user.userRoles.map((ur) => ur.role.name),
    };

    sendSuccess(res, userWithRoles, 'Lấy thông tin user thành công');
};

// ========================================
// 🔐 ROLE MANAGEMENT (Admin only)
// ========================================

/**
 * POST /api/admin/users/:id/roles
 * Gán role cho user
 */
export const assignRole = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id: userId } = req.params;
    const { roleName } = req.body;

    if (!roleName) {
        throw new AppError('Role name là bắt buộc', 400);
    }

    // Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User không tồn tại', 404);
    }

    // Tìm role
    const role = await prisma.role.findUnique({
        where: { name: roleName },
    });

    if (!role) {
        throw new AppError('Role không tồn tại', 404);
    }

    // Kiểm tra đã có role chưa
    const existingUserRole = await prisma.userRole.findFirst({
        where: {
            userId,
            roleId: role.id,
        },
    });

    if (existingUserRole) {
        throw new AppError('User đã có role này rồi', 409);
    }

    // Gán role
    await prisma.userRole.create({
        data: {
            userId,
            roleId: role.id,
        },
    });

    logger.success(`Admin gán role "${roleName}" cho user ${user.email}`);
    sendCreated(res, null, `Gán role "${roleName}" thành công`);
};

/**
 * DELETE /api/admin/users/:id/roles/:roleName
 * Xóa role khỏi user
 */
export const removeRole = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id: userId, roleName } = req.params;

    // Tìm role
    const role = await prisma.role.findUnique({
        where: { name: roleName },
    });

    if (!role) {
        throw new AppError('Role không tồn tại', 404);
    }

    // Tìm user role
    const userRole = await prisma.userRole.findFirst({
        where: {
            userId,
            roleId: role.id,
        },
    });

    if (!userRole) {
        throw new AppError('User không có role này', 404);
    }

    // Xóa role
    await prisma.userRole.delete({
        where: {
            id: userRole.id,
        },
    });

    logger.success(`Admin xóa role "${roleName}" khỏi user`);
    sendSuccess(res, null, `Xóa role "${roleName}" thành công`);
};

// ========================================
// ✅ VERIFY LECTURER (Admin only)
// ========================================

/**
 * GET /api/admin/lecturers/unlinked
 * Lấy danh sách giảng viên chưa liên kết với user
 */
export const getUnlinkedLecturers = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const lecturers = await prisma.lecturer.findMany({
        where: {
            userId: null, // Chưa liên kết với user nào
        },
        select: {
            id: true,
            fullName: true,
            staffId: true,
            email: true,
            userId: true,
            createdAt: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    sendSuccess(res, lecturers, 'Lấy danh sách giảng viên chưa liên kết thành công');
};

/**
 * POST /api/admin/lecturers/:lecturerId/verify
 * Verify lecturer - Liên kết với user (THỦ CÔNG)
 * 
 * Body: { userId: "uuid" }
 */
export const verifyLecturer = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { lecturerId } = req.params;
    const { userId } = req.body;

    if (!userId) {
        throw new AppError('userId là bắt buộc', 400);
    }

    // 1. Kiểm tra lecturer tồn tại
    const lecturer = await prisma.lecturer.findUnique({
        where: { id: lecturerId },
    });

    if (!lecturer) {
        throw new AppError('Lecturer không tồn tại', 404);
    }

    // 2. Kiểm tra user tồn tại
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError('User không tồn tại', 404);
    }

    // 3. Kiểm tra user đã được liên kết với lecturer khác chưa
    const existingLecturer = await prisma.lecturer.findFirst({
        where: {
            userId,
            id: { not: lecturerId }, // Không tính lecturer hiện tại
        },
    });

    if (existingLecturer) {
        throw new AppError('User này đã được liên kết với lecturer khác', 409);
    }

    // 4. Liên kết user với lecturer
    await prisma.lecturer.update({
        where: { id: lecturerId },
        data: {
            userId,
        },
    });

    // 5. Gán role "lecturer" cho user (nếu chưa có)
    const lecturerRole = await prisma.role.findUnique({
        where: { name: 'lecturer' },
    });

    if (lecturerRole) {
        const existingUserRole = await prisma.userRole.findFirst({
            where: {
                userId,
                roleId: lecturerRole.id,
            },
        });

        if (!existingUserRole) {
            await prisma.userRole.create({
                data: {
                    userId,
                    roleId: lecturerRole.id,
                },
            });
        }
    }

    logger.success(
        `Admin verified lecturer ${lecturer.fullName} (${lecturer.staffId}) → User ${user.email}`
    );
    sendSuccess(res, null, 'Verify lecturer thành công');
};

/**
 * POST /api/admin/lecturers/:lecturerId/unverify
 * Hủy verify lecturer
 */
export const unverifyLecturer = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { lecturerId } = req.params;

    const lecturer = await prisma.lecturer.findUnique({
        where: { id: lecturerId },
    });

    if (!lecturer) {
        throw new AppError('Lecturer không tồn tại', 404);
    }

    // Hủy liên kết
    await prisma.lecturer.update({
        where: { id: lecturerId },
        data: {
            userId: null,
        },
    });

    logger.warn(`Admin unverified lecturer ${lecturer.fullName}`);
    sendSuccess(res, null, 'Hủy verify lecturer thành công');
};
