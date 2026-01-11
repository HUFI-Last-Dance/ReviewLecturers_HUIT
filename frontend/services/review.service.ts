import api from '@/lib/axios';

export const reviewService = {
    // Tạo review
    createReview: async (data: { teachingAssignmentId: string; content: string; isAnonymous?: boolean }) => {
        const response = await api.post('/community/reviews', data);
        return response.data;
    },

    // Tạo reply
    createReply: async (data: { reviewId: string; parentId?: string; content: string }) => {
        const response = await api.post('/community/replies', data);
        return response.data;
    },

    // Vote Review
    voteReview: async (reviewId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        const response = await api.post(`/community/votes/reviews/${reviewId}`, { voteType });
        return response.data;
    },

    // Vote Reply
    voteReply: async (replyId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        const response = await api.post(`/community/votes/replies/${replyId}`, { voteType });
        return response.data;
    },

    // Get Review Detail (cho reply list)
    getReviewById: async (id: string) => {
        const response = await api.get(`/community/reviews/${id}`);
        return response.data;
    },

    // Get my vote for review
    getMyReviewVote: async (reviewId: string) => {
        try {
            const response = await api.get(`/community/votes/reviews/${reviewId}/my-vote`);
            return response.data;
        } catch (e) {
            return { voteType: null };
        }
    },

    getMyReviews: async (params?: { page: number; limit: number }) => {
        const response = await api.get('/community/reviews/me', { params });
        return response.data;
    },

    getRecentReviews: async () => {
        const response = await api.get('/community/reviews/recent');
        return response.data;
    },

    deleteReview: async (id: string) => {
        const response = await api.delete(`/community/reviews/${id}`);
        return response.data;
    }
};
