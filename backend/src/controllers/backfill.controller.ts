import { Request, Response } from 'express';
import prisma from '../config/database';
import { sendSuccess } from '../utils/response';
import { removeVietnameseDiacritics } from '../utils/vietnamese';

/**
 * POST /api/admin/backfill-lecturers
 * Backfill cleanName and engagementScore for all lecturers
 */
export const backfillLecturers = async (
    req: Request,
    res: Response
): Promise<void> => {
    console.log('Starting backfill...');

    // Fetch all lecturers with necessary data for calculation
    const lecturers = await prisma.lecturer.findMany({
        include: {
            teachingAssignments: {
                include: {
                    reviews: {
                        select: {
                            upvoteCount: true,
                            downvoteCount: true,
                            _count: {
                                select: {
                                    replies: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    let updatedCount = 0;

    // Process in parallel (or sequential if too many connections)
    // For safety, sequential or batched is better. Here we do sequential for simplicity.
    for (const lecturer of lecturers) {
        // 1. Calculate cleanName
        const cleanName = removeVietnameseDiacritics(lecturer.fullName.toLowerCase());

        // 2. Calculate engagementScore
        let reviewsCount = 0;
        let totalReviewVotes = 0;

        lecturer.teachingAssignments.forEach(ta => {
            ta.reviews.forEach(review => {
                reviewsCount += 1 + (review._count?.replies || 0);
                totalReviewVotes += review.upvoteCount + review.downvoteCount;
            });
        });

        const lecturerVotes = lecturer.upvoteCount + lecturer.downvoteCount;
        const engagementScore = (lecturerVotes * 2) + totalReviewVotes + reviewsCount;

        // 3. Update
        await prisma.lecturer.update({
            where: { id: lecturer.id },
            data: {
                cleanName,
                engagementScore
            }
        });

        updatedCount++;
        if (updatedCount % 100 === 0) {
            console.log(`Backfilled ${updatedCount} lecturers...`);
        }
    }

    sendSuccess(res, { count: updatedCount }, `Đã cập nhật backfill thành công cho ${updatedCount} giảng viên`);
};
