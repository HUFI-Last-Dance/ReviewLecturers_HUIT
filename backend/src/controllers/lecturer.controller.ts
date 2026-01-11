import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';
import { removeVietnameseDiacritics } from '../utils/vietnamese';

// ========================================
// 👨‍🏫 LECTURER API (Public - Không cần auth)
// ========================================

/**
 * GET /api/lecturers
 * Lấy danh sách giảng viên (có pagination, filter)
 */
export const getAllLecturers = async (
    req: Request,
    res: Response
): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const sort = (req.query.sort as string) || 'engagement'; // Default sort by engagement
    const search = req.query.search as string;
    const degreeCode = req.query.degreeCode as string; // Filter by degree

    // Build where clause
    const where: any = {};

    // Filter by degree code
    if (degreeCode && degreeCode.trim()) {
        where.degree = { code: degreeCode.trim() };
    }

    // NOTE: Search filtering is done in JavaScript after mapping 
    // to support Vietnamese diacritics (e.g. "Le" matches "Lê")

    // For search or engagement sorting, we need all records to filter/sort properly
    const needsAllRecords = (search && search.trim()) || sort === 'engagement';
    const fetchLimit = needsAllRecords ? 1000 : limit;
    const fetchSkip = needsAllRecords ? 0 : skip;

    const [lecturers, total] = await Promise.all([
        prisma.lecturer.findMany({
            where,
            skip: fetchSkip,
            take: fetchLimit,
            select: {
                id: true,
                fullName: true,
                staffId: true,
                upvoteCount: true,
                downvoteCount: true,
                degree: {
                    select: {
                        code: true,
                        name: true,
                    },
                },
                // Đếm số teaching assignments
                _count: {
                    select: {
                        teachingAssignments: true,
                    },
                },
                // Lấy danh sách teaching assignments với reviews và votes
                teachingAssignments: {
                    select: {
                        reviews: {
                            select: {
                                upvoteCount: true,
                                downvoteCount: true,
                                _count: {
                                    select: {
                                        replies: true
                                    }
                                }
                            },
                        },
                    },
                },
            },
            orderBy: { fullName: 'asc' },
        }),
        prisma.lecturer.count({ where }),
    ]);

    // Map and calculate engagement score
    let mappedLecturers = lecturers.map((lecturer) => {
        // Count reviews and their votes
        let reviewsCount = 0;
        let totalReviewVotes = 0;

        lecturer.teachingAssignments.forEach(ta => {
            ta.reviews.forEach(review => {
                reviewsCount += 1 + (review._count?.replies || 0); // 1 root + replies
                totalReviewVotes += review.upvoteCount + review.downvoteCount;
            });
        });

        // Calculate engagement score:
        // (lecturerVotes * 2) + totalReviewVotes + reviewsCount
        const lecturerVotes = lecturer.upvoteCount + lecturer.downvoteCount;
        const engagementScore = (lecturerVotes * 2) + totalReviewVotes + reviewsCount;

        return {
            id: lecturer.id,
            fullName: lecturer.fullName,
            staffId: lecturer.staffId,
            degree: lecturer.degree?.name || null,
            degreeCode: lecturer.degree?.code || null,
            upvoteCount: lecturer.upvoteCount,
            downvoteCount: lecturer.downvoteCount,
            totalVotes: lecturerVotes,
            assignmentsCount: lecturer._count.teachingAssignments,
            reviewsCount,
            totalReviewVotes,
            engagementScore,
        };
    });

    // Vietnamese diacritics-insensitive search filtering
    if (search && search.trim()) {
        const searchNormalized = removeVietnameseDiacritics(search.trim().toLowerCase());
        mappedLecturers = mappedLecturers.filter(l => {
            const nameNormalized = removeVietnameseDiacritics(l.fullName.toLowerCase());
            return nameNormalized.includes(searchNormalized) ||
                l.fullName.toLowerCase().includes(search.trim().toLowerCase());
        });
    }

    // Get filtered count before pagination
    const filteredTotal = mappedLecturers.length;

    // Apply sorting
    if (sort === 'engagement') {
        mappedLecturers = mappedLecturers.sort((a, b) => b.engagementScore - a.engagementScore);
    }

    // Apply pagination after filtering
    if (needsAllRecords) {
        mappedLecturers = mappedLecturers.slice(skip, skip + limit);
    }

    const response = {
        lecturers: mappedLecturers,
        pagination: {
            page,
            limit,
            total: needsAllRecords ? filteredTotal : total,
            totalPages: Math.ceil((needsAllRecords ? filteredTotal : total) / limit),
        },
    };

    sendSuccess(res, response, 'Lấy danh sách giảng viên thành công');
};

/**
 * GET /api/lecturers/:id
 * Lấy chi tiết giảng viên
 */
export const getLecturerById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    // Check if user is authenticated (optional - for myVote)
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.substring(7);
            const jwt = require('jsonwebtoken');
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            userId = payload.userId;
        } catch (e) {
            // Token invalid, ignore - user not authenticated
        }
    }

    const lecturer = await prisma.lecturer.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            staffId: true,
            upvoteCount: true,
            downvoteCount: true,
            email: true,
            createdAt: true,
            degree: {
                select: {
                    code: true,
                    name: true,
                },
            },
            teachingAssignments: {
                select: {
                    id: true,
                    classCode: true,
                    createdAt: true,
                    subject: {
                        select: {
                            id: true,
                            code: true,
                            name: true,
                        },
                    },
                    term: {
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
                    reviews: {
                        select: {
                            upvoteCount: true,
                            downvoteCount: true,
                            _count: {
                                select: {
                                    replies: true
                                }
                            }
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!lecturer) {
        throw new AppError('Giảng viên không tồn tại', 404);
    }

    // Get user's vote if authenticated
    let myVote: 'UPVOTE' | 'DOWNVOTE' | null = null;
    if (userId) {
        const vote = await prisma.lecturerVote.findUnique({
            where: {
                userId_lecturerId: {
                    userId: userId,
                    lecturerId: id,
                },
            },
        });
        if (vote) {
            myVote = vote.voteType as 'UPVOTE' | 'DOWNVOTE';
        }
    }

    // Calculate engagement score
    let reviewsCount = 0;
    let totalReviewVotes = 0;

    lecturer.teachingAssignments.forEach((ta: any) => {
        reviewsCount += ta._count.reviews; // This only counts root reviews for now, we might want to update this logic if engagement score needs to include replies too
        if (ta.reviews) {
            ta.reviews.forEach((r: any) => {
                totalReviewVotes += (r.upvoteCount || 0) + (r.downvoteCount || 0);
            });
        }
    });

    const lecturerVotes = (lecturer.upvoteCount || 0) + (lecturer.downvoteCount || 0);
    const engagementScore = (lecturerVotes * 2) + totalReviewVotes + reviewsCount;

    const response = {
        ...lecturer,
        myVote,
        engagementScore,
        teachingAssignments: lecturer.teachingAssignments.map((ta) => {
            const rootReviews = ta._count.reviews;
            const replies = ta.reviews.reduce((acc: number, curr: any) => acc + (curr._count?.replies || 0), 0);
            return {
                id: ta.id,
                classCode: ta.classCode,
                createdAt: ta.createdAt,
                subject: ta.subject,
                term: ta.term,
                reviewsCount: rootReviews + replies, // Sum of root + replies
            };
        }),
    };

    sendSuccess(res, response, 'Lấy thông tin giảng viên thành công');
};

// ========================================
// 👍 VOTE LECTURER
// ========================================

/**
 * POST /api/lecturers/:id/vote
 * Body: { voteType: "UPVOTE" | "DOWNVOTE" }
 */
import { AuthenticatedRequest } from '../types/auth.types';

export const voteLecturer = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<void> => {
    const { id: lecturerId } = req.params;
    const { voteType } = req.body;
    const userId = req.user?.userId; // Từ Auth Middleware (JWT payload)

    if (!userId) {
        throw new AppError('Unauthorized', 401);
    }

    if (!['UPVOTE', 'DOWNVOTE'].includes(voteType)) {
        throw new AppError('Vote type không hợp lệ', 400);
    }

    // 1. Check lecturer exist
    const lecturer = await prisma.lecturer.findUnique({
        where: { id: lecturerId },
    });

    if (!lecturer) {
        throw new AppError('Giảng viên không tồn tại', 404);
    }

    // 2. Check existing vote
    const existingVote = await prisma.lecturerVote.findUnique({
        where: {
            userId_lecturerId: {
                userId,
                lecturerId,
            },
        },
    });

    if (existingVote) {
        if (existingVote.voteType === voteType) {
            // Unvote (Toggle off)
            await prisma.$transaction(async (tx) => {
                await tx.lecturerVote.delete({
                    where: { id: existingVote.id },
                });
                // Giảm count
                await tx.lecturer.update({
                    where: { id: lecturerId },
                    data: {
                        [voteType === 'UPVOTE' ? 'upvoteCount' : 'downvoteCount']: {
                            decrement: 1,
                        },
                    },
                });
            });
            sendSuccess(res, { voted: false, voteType: null }, 'Đã hủy vote');
        } else {
            // Change vote (Up -> Down or Down -> Up)
            await prisma.$transaction(async (tx) => {
                await tx.lecturerVote.update({
                    where: { id: existingVote.id },
                    data: { voteType },
                });
                // Update counts
                const oldVoteType = existingVote.voteType;
                await tx.lecturer.update({
                    where: { id: lecturerId },
                    data: {
                        [oldVoteType === 'UPVOTE' ? 'upvoteCount' : 'downvoteCount']: {
                            decrement: 1,
                        },
                        [voteType === 'UPVOTE' ? 'upvoteCount' : 'downvoteCount']: {
                            increment: 1,
                        },
                    },
                });
            });
            sendSuccess(res, { voted: true, voteType }, 'Đã thay đổi vote thành công');
        }
    } else {
        // Vote mới
        await prisma.$transaction(async (tx) => {
            await tx.lecturerVote.create({
                data: {
                    userId,
                    lecturerId,
                    voteType,
                },
            });
            // Tăng count
            await tx.lecturer.update({
                where: { id: lecturerId },
                data: {
                    [voteType === 'UPVOTE' ? 'upvoteCount' : 'downvoteCount']: {
                        increment: 1,
                    },
                },
            });
        });

        sendSuccess(res, { voted: true, voteType }, 'Vote thành công');
    }
};


