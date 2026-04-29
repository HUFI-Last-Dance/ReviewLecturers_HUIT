import api from '@/lib/axios';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

export const authService = {
  login: async (data: LoginDto) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterDto) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  getMe: async () => {
    const response = await api.get<unknown>('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { fullName: string; studentId?: string }) => {
    const response = await api.put<unknown>('/auth/profile', data);
    return response.data;
  },
};
