import { Request, Response } from 'express';
import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';
import { sendSuccess, sendCreated } from '../utils/response';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken } from '../utils/jwt';
import {
  RegisterDto,
  LoginDto,
  AuthResponse,
  UserResponse,
  AuthenticatedRequest,
} from '../types/auth.types';
import logger from '../utils/logger';

// ========================================
// 🔐 AUTH CONTROLLER
// ========================================

/**
 * POST /api/auth/register
 * Đăng ký user mới
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, fullName, studentId }: RegisterDto = req.body;

  // 1. Validate input
  if (!email || !password || !fullName) {
    throw new AppError('Email, password và họ tên là bắt buộc', 400);
  }

  // Validate email format (simple)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError('Email không hợp lệ', 400);
  }

  // Validate password length
  if (password.length < 6) {
    throw new AppError('Mật khẩu phải có ít nhất 6 ký tự', 400);
  }

  // 2. Check email đã tồn tại chưa
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email đã được sử dụng', 409);
  }

  // 3. Hash password
  const hashedPassword = await hashPassword(password);

  // 4. Tạo user mới
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      fullName,
      studentId: studentId || null,
    },
  });

  // 5. Tìm role "student" (hoặc tạo nếu chưa có)
  // Mặc định tất cả người dùng đăng ký đều là role 'student'
  // Admin sẽ cấp quyền lecturer nếu cần
  let studentRole = await prisma.role.findUnique({
    where: { name: 'student' },
  });

  if (!studentRole) {
    // Tạo role student nếu chưa có
    studentRole = await prisma.role.create({
      data: {
        name: 'student',
        description: 'Sinh viên',
      },
    });
    logger.info('Created default student role');
  }

  // 6. Gán role "student" cho user mới
  await prisma.userRole.create({
    data: {
      userId: newUser.id,
      roleId: studentRole.id,
    },
  });

  // 7. Generate JWT token
  const accessToken = generateAccessToken({
    userId: newUser.id,
    email: newUser.email,
    roles: ['student'],
  });

  // 8. Prepare response (loại bỏ password)
  const userResponse: UserResponse = {
    id: newUser.id,
    email: newUser.email,
    fullName: newUser.fullName,
    studentId: newUser.studentId,
    roles: ['student'],
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  };

  const response: AuthResponse = {
    user: userResponse,
    accessToken,
  };

  logger.success(`User registered: ${email}`);
  sendCreated(res, response, 'Đăng ký thành công');
};

/**
 * POST /api/auth/login
 * Đăng nhập
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: LoginDto = req.body;

  // 1. Validate input
  if (!email || !password) {
    throw new AppError('Email và password là bắt buộc', 400);
  }

  // 2. Tìm user theo email
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  // 3. So sánh password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Email hoặc mật khẩu không đúng', 401);
  }

  // 4. Lấy danh sách roles
  const roles = user.userRoles.map((ur) => ur.role.name);

  // 5. Generate JWT token
  const accessToken = generateAccessToken({
    userId: user.id,
    email: user.email,
    roles,
  });

  // 6. Prepare response
  const userResponse: UserResponse = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    studentId: user.studentId,
    roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  const response: AuthResponse = {
    user: userResponse,
    accessToken,
  };

  logger.success(`User logged in: ${email}`);
  sendSuccess(res, response, 'Đăng nhập thành công');
};

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần auth)
 */
export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // req.user được thêm bởi auth middleware
  const { userId } = req.user!;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User không tồn tại', 404);
  }

  const roles = user.userRoles.map((ur) => ur.role.name);

  const userResponse: UserResponse = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    studentId: user.studentId,
    roles,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  sendSuccess(res, userResponse, 'Lấy thông tin user thành công');
};

/**
 * PUT /api/auth/profile
 * Cập nhật thông tin profile (fullName, studentId)
 * Có cooldown 3 ngày giữa các lần cập nhật
 */
export const updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { userId } = req.user!;
  const { fullName, studentId } = req.body;

  // 1. Validate input
  if (!fullName || fullName.trim().length < 2) {
    throw new AppError('Họ tên phải có ít nhất 2 ký tự', 400);
  }

  // 2. Get current user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: { role: true },
      },
    },
  });

  if (!user) {
    throw new AppError('User không tồn tại', 404);
  }

  // 3. Check cooldown (3 days = 259200000 ms)
  const COOLDOWN_DAYS = 3;
  const COOLDOWN_MS = COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

  if (user.profileUpdatedAt) {
    const timeSinceLastUpdate = Date.now() - user.profileUpdatedAt.getTime();
    if (timeSinceLastUpdate < COOLDOWN_MS) {
      const remainingMs = COOLDOWN_MS - timeSinceLastUpdate;
      const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      throw new AppError(`Bạn chỉ có thể cập nhật thông tin sau ${remainingDays} ngày nữa`, 429);
    }
  }

  // 4. Update profile
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      fullName: fullName.trim(),
      studentId: studentId?.trim() || null,
      profileUpdatedAt: new Date(),
    },
  });

  const roles = user.userRoles.map((ur) => ur.role.name);

  const userResponse: UserResponse = {
    id: updatedUser.id,
    email: updatedUser.email,
    fullName: updatedUser.fullName,
    studentId: updatedUser.studentId,
    roles,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };

  logger.success(`User profile updated: ${user.email}`);
  sendSuccess(res, userResponse, 'Cập nhật thông tin thành công');
};
