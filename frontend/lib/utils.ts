import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const getApiUrl = () => {
    // Nếu ở phía Client (trình duyệt), gọi qua proxy để giấu API thật
    if (typeof window !== 'undefined') {
        return '/api/proxy';
    }

    // Nếu ở phía Server, gọi trực tiếp đến Backend để tối ưu tốc độ
    let url = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `https://${url}`;
    }
    return url;
};

export const API_URL = getApiUrl();
