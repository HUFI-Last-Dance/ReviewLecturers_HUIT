import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { verifyToken } from '../utils/jwt';

// ========================================
// 📋 TEACHING ASSIGNMENT API (Public + CORE)
// ========================================
// Đây là API CỐT LÕI - nơi sinh viên nhận xét
// ========================================

/**
 * GET /api/assignments
 * Lấy danh sách teaching assignments (có filter)
 * Query params: ?lecturerId=xxx&subjectId=xxx&termId=xxx&page=1&limit=20
 */
export const getAllAssignments = async (
    req: Request,
    res: Response
): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // Filters
    const lecturerId = req.query.lecturerId as string;
    const subjectId = req.query.subjectId as string;
    const termId = req.query.termId as string;

    // Build where clause
    const where: any = {};
    if (lecturerId) where.lecturerId = lecturerId;
    if (subjectId) where.subjectId = subjectId;
    if (termId) where.termId = termId;

    const [assignments, total] = await Promise.all([
        prisma.teachingAssignment.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                classCode: true,
                lecturer: {
                    select: {
                        id: true,
                        fullName: true,
                        staffId: true,
                    },
                },
                subject: {
                    select: {
                        id: true,
                        code: true,
                        name: true,
                        credits: true,
                    },
                },
                term: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                campus: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                _count: {
                    select: {
                        reviews: true,
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma.teachingAssignment.count({ where }),
    ]);

    const response = {
        assignments: assignments.map((assignment) => ({
            id: assignment.id,
            classCode: assignment.classCode,
            lecturer: assignment.lecturer,
            subject: assignment.subject,
            term: assignment.term,
            campus: assignment.campus,
            reviewsCount: assignment._count.reviews,
            createdAt: assignment.createdAt,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    sendSuccess(res, response, 'Lấy danh sách phân công giảng dạy thành công');
};

/**
 * GET /api/assignments/:id
 * Lấy chi tiết teaching assignment
 * (Dùng để xem reviews về assignment này)
 */
export const getAssignmentById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;
    let userId: string | null = null;

    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const payload = verifyToken(token);
            // @ts-ignore
            userId = payload.userId;
        }
    } catch (e) { }

    const assignment = await prisma.teachingAssignment.findUnique({
        where: { id: id as string },
        select: {
            id: true,
            classCode: true,
            lecturer: {
                select: {
                    id: true,
                    fullName: true,
                    staffId: true,
                    email: true,
                },
            },
            subject: {
                select: {
                    id: true,
                    code: true,
                    name: true,
                    credits: true,
                },
            },
            term: {
                select: {
                    id: true,
                    name: true,
                    startDate: true,
                    endDate: true,
                },
            },
            campus: {
                select: {
                    id: true,
                    name: true,
                    address: true,
                },
            },
            reviews: {
                select: {
                    id: true,
                    content: true,
                    isAnonymous: true,
                    upvoteCount: true,
                    downvoteCount: true,
                    createdAt: true,
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
                    votes: userId ? {
                        where: { userId: userId },
                        select: { voteType: true }
                    } : undefined,
                    _count: {
                        select: {
                            replies: true,
                        },
                    },
                    feedbackCommunication: true,
                    feedbackKnowledge: true,
                    feedbackExpertise: true,
                    feedbackAttitude: true,
                },
                orderBy: [
                    { upvoteCount: 'desc' },
                    { createdAt: 'desc' },
                ],
            },
            _count: {
                select: {
                    reviews: true,
                },
            },
            createdAt: true,
        },
    });

    if (!assignment) {
        throw new AppError('Phân công giảng dạy không tồn tại', 404);
    }

    const response = {
        ...assignment,
        reviews: assignment.reviews.map((review) => ({
            id: review.id,
            content: review.content,
            isAnonymous: review.isAnonymous,
            author: review.isAnonymous ? null : {
                id: review.user.id,
                fullName: review.user.fullName,
                roles: review.user.userRoles.map((ur: any) => ur.role.name),
            },
            upvoteCount: review.upvoteCount,
            downvoteCount: review.downvoteCount,
            repliesCount: review._count.replies,
            userVote: (review as any).votes?.[0]?.voteType || null,
            createdAt: review.createdAt,
            feedbackCommunication: review.feedbackCommunication,
            feedbackKnowledge: review.feedbackKnowledge,
            feedbackExpertise: review.feedbackExpertise,
            feedbackAttitude: review.feedbackAttitude,
        })),
        reviewsCount: assignment._count.reviews,
    };

    sendSuccess(res, response, 'Lấy thông tin phân công giảng dạy thành công');
};
