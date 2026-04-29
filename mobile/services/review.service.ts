import api from '@/lib/axios';
import { Review, Reply } from '@/types/academic';

interface CreateReviewPayload {
    content: string;
    isAnonymous?: boolean;
    feedbackCommunication?: string;
    feedbackKnowledge?: string;
    feedbackExpertise?: string;
    feedbackAttitude?: string;
}

interface CreateReplyPayload {
    content: string;
    isAnonymous?: boolean;
}

export const reviewService = {
    // Tạo review mới
    createReview: async (assignmentId: string, payload: CreateReviewPayload) => {
        const response = await api.post(`/assignments/${assignmentId}/reviews`, payload);
        return response.data;
    },

    // Vote review
    voteReview: async (reviewId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        const response = await api.post(`/reviews/${reviewId}/vote`, { voteType });
        return response.data;
    },

    // Tạo reply
    createReply: async (reviewId: string, payload: CreateReplyPayload) => {
        const response = await api.post(`/reviews/${reviewId}/replies`, payload);
        return response.data;
    },

    // Vote reply
    voteReply: async (replyId: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        const response = await api.post(`/replies/${replyId}/vote`, { voteType });
        return response.data;
    },

    // Lấy replies của một review
    getReplies: async (reviewId: string): Promise<{ success: boolean; data: Reply[] }> => {
        const response = await api.get(`/reviews/${reviewId}/replies`);
        return response.data;
    },

    // Xóa review (chỉ owner hoặc admin)
    deleteReview: async (reviewId: string) => {
        const response = await api.delete(`/reviews/${reviewId}`);
        return response.data;
    }
};
