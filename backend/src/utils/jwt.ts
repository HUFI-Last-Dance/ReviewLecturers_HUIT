import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/auth.types';

// ========================================
// 🔑 JWT UTILITIES
// ========================================

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-CHANGE-THIS';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Generate JWT Access Token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    } as jwt.SignOptions);
};

/**
 * Verify JWT Token
 * @throws Error nếu token invalid hoặc expired
 */
export const verifyToken = (token: string): JwtPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') {
            throw new Error('Token đã hết hạn');
        } else if (error.name === 'JsonWebTokenError') {
            throw new Error('Token không hợp lệ');
        } else {
            throw new Error('Lỗi xác thực token');
        }
    }
};

/**
 * Decode JWT Token (không verify, chỉ decode)
 * Dùng để debug hoặc lấy thông tin khi không cần verify
 */
export const decodeToken = (token: string): JwtPayload | null => {
    try {
        return jwt.decode(token) as JwtPayload;
    } catch {
        return null;
    }
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import { generateAccessToken, verifyToken } from '@/utils/jwt';
//
// // Generate token
// const token = generateAccessToken({
//   userId: user.id,
//   email: user.email,
//   roles: ['student']
// });
//
// // Verify token
// try {
//   const payload = verifyToken(token);
//   console.log(payload.userId);
// } catch (error) {
//   console.error('Invalid token');
// }
// ========================================
