import { PrismaClient } from '@prisma/client';

// ========================================
// 🗄️ PRISMA CLIENT SINGLETON
// ========================================
// Tại sao cần singleton?
// - Tránh tạo quá nhiều kết nối database (memory leak)
// - Hot reload trong dev mode không tạo instance mới
// - Performance tốt hơn (reuse connection pool)
// ========================================

// Extend PrismaClient nếu cần (soft delete, custom methods, etc)
const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn'] // Hiển thị queries trong dev
        : ['error'], // Chỉ hiển thị errors trong production
  });
};

// Declare global type cho TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Sử dụng global variable để tránh tạo instance mới khi hot reload
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// Trong development, lưu vào global để hot reload không tạo instance mới
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

// ========================================
// 📝 CÁCH SỬ DỤNG
// ========================================
// import prisma from '@/config/database';
//
// const users = await prisma.user.findMany();
// const user = await prisma.user.create({ data: {...} });
// ========================================
