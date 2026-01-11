import { Request } from 'express';

// ========================================
// 🔐 AUTHENTICATION TYPES
// ========================================

/**
 * Register Request Body
 */
export interface RegisterDto {
    email: string;
    password: string;
    fullName: string;
    studentId?: string; // Optional, vì có thể là admin/lecturer
}

/**
 * Login Request Body
 */
export interface LoginDto {
    email: string;
    password: string;
}

/**
 * JWT Payload (data lưu trong token)
 */
export interface JwtPayload {
    userId: string;
    email: string;
    roles: string[]; // ['student'], ['admin'], ['lecturer'], etc.
}

/**
 * User data (không bao gồm password)
 */
export interface UserResponse {
    id: string;
    email: string;
    fullName: string;
    studentId: string | null;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Auth Response (login/register thành công)
 */
export interface AuthResponse {
    user: UserResponse;
    accessToken: string;
    // refreshToken?: string; // Sẽ thêm sau
}

/**
 * Authenticated Request (có user info trong req)
 */
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload; // Thêm bởi auth middleware
}
