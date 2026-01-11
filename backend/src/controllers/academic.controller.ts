import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess } from '../utils/response';

// ========================================
// 📚 SUBJECT API (Public)
// ========================================

/**
 * GET /api/subjects
 * Lấy danh sách môn học
 */
export const getAllSubjects = async (
    req: Request,
    res: Response
): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const [subjects, total] = await Promise.all([
        prisma.subject.findMany({
            skip,
            take: limit,
            select: {
                id: true,
                code: true,
                name: true,
                credits: true,
                _count: {
                    select: {
                        teachingAssignments: true,
                    },
                },
            },
            orderBy: {
                code: 'asc',
            },
        }),
        prisma.subject.count(),
    ]);

    const response = {
        subjects: subjects.map((subject) => ({
            id: subject.id,
            code: subject.code,
            name: subject.name,
            credits: subject.credits,
            assignmentsCount: subject._count.teachingAssignments,
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };

    sendSuccess(res, response, 'Lấy danh sách môn học thành công');
};

/**
 * GET /api/subjects/:id
 * Lấy chi tiết môn học
 */
export const getSubjectById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
            teachingAssignments: {
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
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!subject) {
        throw new AppError('Môn học không tồn tại', 404);
    }

    const response = {
        ...subject,
        teachingAssignments: subject.teachingAssignments.map((ta) => ({
            id: ta.id,
            classCode: ta.classCode,
            lecturer: ta.lecturer,
            term: ta.term,
            reviewsCount: ta._count.reviews,
        })),
    };

    sendSuccess(res, response, 'Lấy thông tin môn học thành công');
};

// ========================================
// 📅 ACADEMIC TERM API (Public)
// ========================================

/**
 * GET /api/terms
 * Lấy danh sách học kỳ
 */
export const getAllTerms = async (
    req: Request,
    res: Response
): Promise<void> => {
    const terms = await prisma.academicTerm.findMany({
        select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            _count: {
                select: {
                    teachingAssignments: true,
                },
            },
        },
        orderBy: {
            startDate: 'desc',
        },
    });

    const response = terms.map((term) => ({
        id: term.id,
        name: term.name,
        startDate: term.startDate,
        endDate: term.endDate,
        assignmentsCount: term._count.teachingAssignments,
    }));

    sendSuccess(res, response, 'Lấy danh sách học kỳ thành công');
};

/**
 * GET /api/terms/:id
 * Lấy chi tiết học kỳ
 */
export const getTermById = async (
    req: Request,
    res: Response
): Promise<void> => {
    const { id } = req.params;

    const term = await prisma.academicTerm.findUnique({
        where: { id },
        include: {
            teachingAssignments: {
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
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
        },
    });

    if (!term) {
        throw new AppError('Học kỳ không tồn tại', 404);
    }

    const response = {
        ...term,
        teachingAssignments: term.teachingAssignments.map((ta) => ({
            id: ta.id,
            classCode: ta.classCode,
            lecturer: ta.lecturer,
            subject: ta.subject,
            reviewsCount: ta._count.reviews,
        })),
    };

    sendSuccess(res, response, 'Lấy thông tin học kỳ thành công');
};
