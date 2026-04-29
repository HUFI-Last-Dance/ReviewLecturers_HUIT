import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return '/api/proxy';
    }
    return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

export const API_URL = getApiUrl();
