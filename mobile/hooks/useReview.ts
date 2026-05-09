import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';

interface CreateReviewPayload {
  content: string;
  isAnonymous?: boolean;
  feedbackCommunication?: string;
  feedbackKnowledge?: string;
  feedbackExpertise?: string;
  feedbackAttitude?: string;
}

// Hook tạo review
export function useCreateReview(assignmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => reviewService.createReview(assignmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignment', assignmentId] });
    },
  });
}

// Hook vote review
export function useVoteReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, voteType }: { reviewId: string; voteType: 'UPVOTE' | 'DOWNVOTE' }) =>
      reviewService.voteReview(reviewId, voteType),
    onSuccess: () => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['assignment'] });
    },
  });
}
