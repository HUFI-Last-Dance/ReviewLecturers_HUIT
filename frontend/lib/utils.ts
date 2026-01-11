import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const getApiUrl = () => {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    // Nếu url không bắt đầu bằng http (và không phải relative path bắt đầu bằng /), thêm https://
    if (!url.startsWith('http') && !url.startsWith('/')) {
        url = `https://${url}`;
    }
    return url;
};

export const API_URL = getApiUrl();
