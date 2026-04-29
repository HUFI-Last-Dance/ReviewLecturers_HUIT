import api from '@/lib/axios';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types/auth';

export const authService = {
    // Đăng nhập
    login: async (payload: LoginPayload): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', payload);
        if (response.data.success && response.data.data.token) {
            await SecureStore.setItemAsync('authToken', response.data.data.token);
        }
        return response.data;
    },

    // Đăng ký
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/register', payload);
        if (response.data.success && response.data.data.token) {
            await SecureStore.setItemAsync('authToken', response.data.data.token);
        }
        return response.data;
    },

    // Lấy thông tin user hiện tại
    getMe: async (): Promise<{ success: boolean; data: User }> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    // Đăng xuất
    logout: async (): Promise<void> => {
        await SecureStore.deleteItemAsync('authToken');
    },

    // Kiểm tra đã đăng nhập chưa
    isAuthenticated: async (): Promise<boolean> => {
        const token = await SecureStore.getItemAsync('authToken');
        return !!token;
    },

    // Lấy token hiện tại
    getToken: async (): Promise<string | null> => {
        return await SecureStore.getItemAsync('authToken');
    }
};
