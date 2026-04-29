import { Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { AuthenticatedRequest } from '../types/auth.types';
import logger from '../utils/logger';
import { updateLecturerEngagementScore } from '../utils/score';

// ========================================
// 💬 REVIEW/COMMENT CONTROLLER
// ========================================
// Review = Root comment (nhận xét gốc về teaching assignment)
// ========================================

interface ReviewUser {
  id: string;
  fullName: string;
  userRoles: {
    role: {
      name: string;
    };
  }[];
}

interface ReviewNestedReply {
  id: string;
  content: string;
  user: ReviewUser;
  [key: string]: unknown;
}

/**
 * POST /api/reviews
 * Tạo review mới (yêu cầu đăng nhập)
 *
 * Body: {
 *   teachingAssignmentId: "uuid",
 *   content: "Thầy dạy hay, nhiệt tình...",
 *   isAnonymous: false
 * }
 */
export const createReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const {
    teachingAssignmentId,
    content,
    isAnonymous,
    feedbackCommunication,
    feedbackKnowledge,
    feedbackExpertise,
    feedbackAttitude,
  } = req.body;
  const userId = req.user!.userId;

  // Validate
  if (!teachingAssignmentId || !content) {
    throw new AppError('teachingAssignmentId và content là bắt buộc', 400);
  }

  if (content.length < 10) {
    throw new AppError('Nội dung phải có ít nhất 10 ký tự', 400);
  }

  // Check assignment exists
  const assignment = await prisma.teachingAssignment.findUnique({
    where: { id: teachingAssignmentId as string },
  });

  if (!assignment) {
    throw new AppError('Teaching assignment không tồn tại', 404);
  }

  // Check duplicate: 1 user chỉ được viết 1 review cho 1 assignment
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_teachingAssignmentId: {
        userId: userId as string,
        teachingAssignmentId: teachingAssignmentId as string,
      },
    },
  });

  if (existingReview) {
    throw new AppError('Bạn đã viết review cho assignment này rồi', 409);
  }

  // Create review
  const review = await prisma.review.create({
    data: {
      userId: userId as string,
      teachingAssignmentId: teachingAssignmentId as string,
      content,
      isAnonymous: isAnonymous || false,
      feedbackCommunication,
      feedbackKnowledge,
      feedbackExpertise,
      feedbackAttitude,
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
      teachingAssignment: {
        select: {
          id: true,
          lecturer: {
            select: {
              fullName: true,
            },
          },
          subject: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // Update lecturer engagement score
  updateLecturerEngagementScore(assignment.lecturerId as string).catch(() => {});

  logger.success(`User ${userId} created review for assignment ${teachingAssignmentId}`);

  const response = {
    ...review,
    author: review.isAnonymous
      ? null
      : {
          id: review.user.id,
          fullName: review.user.fullName,
          roles: review.user.userRoles.map((ur) => ur.role.name),
        },
  };

  sendCreated(res, response, 'Tạo review thành công');
};

/**
 * GET /api/reviews/:id
 * Lấy chi tiết review + replies
 */
export const getReviewById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const review = await prisma.review.findUnique({
    where: { id: id as string },
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
      teachingAssignment: {
        select: {
          id: true,
          lecturer: {
            select: {
              id: true,
              fullName: true,
            },
          },
          subject: {
            select: {
              code: true,
              name: true,
            },
          },
        },
      },
      replies: {
        where: {
          parentId: null, // Chỉ lấy replies cấp 1
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
          replies: {
            // Nested replies (cấp 2)
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
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  });

  if (!review) {
    throw new AppError('Review không tồn tại', 404);
  }

  const response = {
    ...review,
    author: review.isAnonymous
      ? null
      : {
          id: review.user.id,
          fullName: review.user.fullName,
          roles: review.user.userRoles.map((ur) => ur.role.name),
        },
    replies: review.replies.map((reply) => ({
      ...reply,
      author: {
        id: reply.user.id,
        fullName: reply.user.fullName,
        roles: reply.user.userRoles.map((ur) => ur.role.name),
      },
      replies: reply.replies.map((nested: unknown) => {
        const n = nested as ReviewNestedReply;
        return {
          ...n,
          author: {
            id: n.user.id,
            fullName: n.user.fullName,
            roles: n.user.userRoles.map((ur) => ur.role.name),
          },
        };
      }),
    })),
  };

  sendSuccess(res, response, 'Lấy review thành công');
};

/**
 * PATCH /api/reviews/:id
 * Sửa review (chỉ author mới được sửa)
 */
export const updateReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user!.userId;

  if (!content || content.length < 10) {
    throw new AppError('Nội dung phải có ít nhất 10 ký tự', 400);
  }

  // Check ownership
  const review = await prisma.review.findUnique({
    where: { id: id as string },
  });

  if (!review) {
    throw new AppError('Review không tồn tại', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('Bạn không có quyền sửa review này', 403);
  }

  // Update
  const updated = await prisma.review.update({
    where: { id: id as string },
    data: { content },
  });

  logger.info(`User ${userId} updated review ${id}`);
  sendSuccess(res, updated, 'Cập nhật review thành công');
};

/**
 * DELETE /api/reviews/:id
 * Xóa review (chỉ author hoặc admin)
 */
export const deleteReview = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const userId = req.user!.userId;
  const roles = req.user!.roles;

  const review = await prisma.review.findUnique({
    where: { id: id as string },
    include: {
      teachingAssignment: {
        select: { lecturerId: true },
      },
    },
  });

  if (!review) {
    throw new AppError('Review không tồn tại', 404);
  }

  // Chỉ author hoặc admin mới xóa được
  if (review.userId !== userId && !roles.includes('admin')) {
    throw new AppError('Bạn không có quyền xóa review này', 403);
  }

  await prisma.review.delete({
    where: { id: id as string },
  });

  // Update engagement score
  if (review.teachingAssignment?.lecturerId) {
    updateLecturerEngagementScore(review.teachingAssignment.lecturerId as string).catch(() => {});
  }

  logger.warn(`Review ${id} deleted by user ${userId}`);
  sendSuccess(res, null, 'Xóa review thành công');
};

/**
 * GET /api/community/reviews/me
 * Lấy danh sách review của tôi
 */
export const getMyReviews = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        teachingAssignment: {
          include: {
            lecturer: { select: { fullName: true } },
            subject: { select: { code: true, name: true } },
          },
        },
        _count: {
          select: { votes: true, replies: true },
        },
      },
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  sendSuccess(
    res,
    { reviews, metadata: { total, page, limit, totalPages: Math.ceil(total / limit) } },
    'Lấy danh sách review thành công',
  );
};

/**
 * GET /api/community/reviews/recent
 * Lấy reviews mới nhất (Public)
 */
export const getRecentReviews = async (req: Request, res: Response): Promise<void> => {
  const reviews = await prisma.review.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
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
      teachingAssignment: {
        include: {
          lecturer: { select: { fullName: true } },
          subject: { select: { name: true, code: true } },
          term: { select: { name: true } },
        },
      },
      _count: { select: { votes: true } },
    },
  });

  const safeReviews = reviews.map((r) => ({
    ...r,
    author: r.isAnonymous
      ? null
      : {
          id: r.user.id,
          fullName: r.user.fullName,
          roles: r.user.userRoles.map((ur) => ur.role.name),
        },
  }));

  sendSuccess(res, safeReviews, 'Lấy recent reviews thành công');
};
