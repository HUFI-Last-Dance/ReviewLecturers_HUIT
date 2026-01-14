import api from '@/lib/axios';
import { LecturerListResponse, LecturerDetailResponse, AssignmentDetailResponse } from '@/types/academic';

export const academicService = {
    // Lấy danh sách giảng viên
    getLecturers: async (params?: { page?: number; limit?: number; search?: string; degreeCode?: string; sort?: string }) => {
        const response = await api.get<LecturerListResponse>('/lecturers', { params });
        return response.data;
    },

    // Lấy chi tiết giảng viên
    getLecturerById: async (id: string) => {
        const response = await api.get<LecturerDetailResponse>(`/lecturers/${id}`);
        return response.data;
    },

    // Lấy chi tiết assignment (kèm reviews)
    getAssignmentById: async (id: string) => {
        const response = await api.get<AssignmentDetailResponse>(`/assignments/${id}`);
        return response.data;
    },

    // Lấy danh sách môn học
    getSubjects: async () => {
        const response = await api.get('/academic/subjects');
        return response.data;
    },

    // Vote giảng viên
    voteLecturer: async (id: string, voteType: 'UPVOTE' | 'DOWNVOTE') => {
        const response = await api.post(`/lecturers/${id}/vote`, { voteType });
        return response.data;
    },

    // Lấy danh sách học kỳ
    getTerms: async () => {
        const response = await api.get('/academic/terms');
        return response.data;
    },

    // 🔖 Bookmarks
    getMyBookmarks: async (params?: { page?: number; limit?: number }) => {
        const response = await api.get<LecturerListResponse>('/bookmarks/lecturers', { params });
        return response.data;
    },

    toggleBookmark: async (id: string) => {
        const response = await api.post(`/bookmarks/lecturers/${id}`);
        return response.data;
    }
};
