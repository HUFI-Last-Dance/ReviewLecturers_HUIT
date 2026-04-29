import api from '@/lib/axios';
import type {
  MyReviewsResponse,
  RecentReviewsResponse,
  ReviewDetailResponse,
  VoteResponse,
} from '@/types/academic';

export const reviewService = {
  // Tạo review
  createReview: async (data: {
    teachingAssignmentId: string;
    content: string;
    isAnonymous?: boolean;
    feedbackCommunication?: string;
    feedbackKnowledge?: string;
    feedbackExpertise?: string;
    feedbackAttitude?: string;
  }) => {
    const response = await api.post<unknown>('/community/reviews', data);
    return response.data;
  },

  // Tạo reply
  createReply: async (data: { reviewId: string; parentId?: string; content: string }) => {
    const response = await api.post<unknown>('/community/replies', data);
    return response.data;
  },

  // Vote Review
  voteReview: async (reviewId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const response = await api.post<VoteResponse>(`/community/votes/reviews/${reviewId}`, {
      voteType,
    });
    return response.data;
  },

  // Vote Reply
  voteReply: async (replyId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
    const response = await api.post<VoteResponse>(`/community/votes/replies/${replyId}`, {
      voteType,
    });
    return response.data;
  },

  // Get Review Detail (cho reply list)
  getReviewById: async (id: string) => {
    const response = await api.get<ReviewDetailResponse>(`/community/reviews/${id}`);
    return response.data;
  },

  // Get my vote for review
  getMyReviewVote: async (reviewId: string) => {
    try {
      const response = await api.get<unknown>(`/community/votes/reviews/${reviewId}/my-vote`);
      return response.data;
    } catch {
      return { voteType: null };
    }
  },

  getMyReviews: async (params?: { page: number; limit: number }) => {
    const response = await api.get<MyReviewsResponse>('/community/reviews/me', { params });
    return response.data;
  },

  getRecentReviews: async () => {
    const response = await api.get<RecentReviewsResponse>('/community/reviews/recent');
    return response.data;
  },

  deleteReview: async (id: string) => {
    const response = await api.delete<unknown>(`/community/reviews/${id}`);
    return response.data;
  },
};
