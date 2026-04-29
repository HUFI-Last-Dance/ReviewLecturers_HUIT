import bcrypt from 'bcrypt';

// ========================================
// 🔒 PASSWORD UTILITIES
// ========================================

const SALT_ROUNDS = 10; // Số rounds để generate salt (10 là chuẩn)

/**
 * Hash password bằng bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
};

/**
 * So sánh password với hash
 * @returns true nếu password đúng, false nếu sai
 */
export const comparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
};

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import { hashPassword, comparePassword } from '@/utils/password';
//
// // Hash password khi register
// const hashedPassword = await hashPassword('myPassword123');
// // Lưu hashedPassword vào database
//
// // So sánh khi login
// const isValid = await comparePassword('myPassword123', hashedPassword);
// if (isValid) {
//   // Password đúng, cho phép login
// }
// ========================================
