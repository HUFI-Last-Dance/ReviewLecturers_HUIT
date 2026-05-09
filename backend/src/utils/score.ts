import prisma from '../config/database';

/**
 * Recalculate and update engagement score for a lecturer
 * Score = (Lecturer Votes * 2) + Total Review Votes + Total Reviews (Root + Replies)
 */
export const updateLecturerEngagementScore = async (lecturerId: string): Promise<void> => {
  // 1. Get Lecturer Votes
  const lecturer = await prisma.lecturer.findUnique({
    where: { id: lecturerId },
    select: { upvoteCount: true, downvoteCount: true },
  });

  if (!lecturer) return;

  const lecturerVotes = (lecturer.upvoteCount || 0) + (lecturer.downvoteCount || 0);

  // 2. Get Reviews Stats (Votes + Count)
  // We need to aggregate from all teaching assignments
  const assignments = await prisma.teachingAssignment.findMany({
    where: { lecturerId },
    select: {
      reviews: {
        select: {
          upvoteCount: true,
          downvoteCount: true,
          _count: {
            select: {
              replies: true,
            },
          },
        },
      },
    },
  });

  let reviewsCount = 0;
  let totalReviewVotes = 0;

  for (const assignment of assignments) {
    for (const rev of assignment.reviews) {
      reviewsCount += 1 + (rev._count?.replies || 0);
      totalReviewVotes += (rev.upvoteCount || 0) + (rev.downvoteCount || 0);
    }
  }

  // 3. Calculate Score
  const engagementScore = lecturerVotes * 2 + totalReviewVotes + reviewsCount;

  // 4. Update
  await prisma.lecturer.update({
    where: { id: lecturerId },
    data: {
      engagementScore,
      totalReviews: reviewsCount,
      totalReviewVotes,
    },
  });
};
