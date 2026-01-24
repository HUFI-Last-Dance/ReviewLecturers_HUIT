import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// API URL - thay đổi khi deploy
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.warn('Error reading auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response và errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token hết hạn hoặc không hợp lệ
            await SecureStore.deleteItemAsync('authToken');
            // TODO: Redirect to login
        }
        return Promise.reject(error);
    }
);

export default api;
