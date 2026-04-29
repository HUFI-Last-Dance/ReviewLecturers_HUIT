import api from '@/lib/axios';

export const adminService = {
    getStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    getUsers: async (params?: { page?: number; limit?: number; search?: string }) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUserRole: async (userId: string, roles: string[]) => {
        const response = await api.patch(`/admin/users/${userId}/roles`, { roles }); // Check API route
        return response.data;
    },

    // Note: Backend might use specific endpoint for verify like /admin/lecturers/verify
    // But generic role update is good.

    getAllReviews: async (params?: { page?: number; limit?: number }) => {
        const response = await api.get('/admin/reviews', { params });
        return response.data;
    },

    deleteReview: async (id: string) => {
        const response = await api.delete(`/community/reviews/${id}`); // Uses community route but admin has permission
        return response.data;
    },

    // Bulk data
    importBulk: async (type: 'lecturers' | 'subjects' | 'terms' | 'assignments', data: any[]) => {
        const response = await api.post(`/admin/bulk/${type}`, { data });
        return response.data;
    }
};
