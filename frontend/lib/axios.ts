import axios from 'axios';
import { API_URL } from './utils';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor: Attach token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor: Handle errors (401 -> Logout)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu token hết hạn hoặc không hợp lệ (trừ trang login/register)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                const path = window.location.pathname;
                // Không tự động xóa token nếu đang ở trang login/register
                // hoặc nếu đây là request vote (user có thể chưa login)
                const isAuthPage = path === '/login' || path === '/register' || path === '/forgot-password';
                const isVoteRequest = error.config?.url?.includes('/vote');

                if (!isAuthPage && !isVoteRequest) {
                    // Chỉ xóa token nếu thực sự có token và nó invalid
                    const token = localStorage.getItem('token');
                    if (token) {
                        console.warn('Token invalid or expired, logging out...');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        // window.location.href = '/login';
                    }
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
