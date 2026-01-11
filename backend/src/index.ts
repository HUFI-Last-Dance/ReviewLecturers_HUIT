import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import logger from './utils/logger';
import { sendSuccess } from './utils/response';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Application = express();
const PORT = process.env.PORT || 5000;

// ========================================
// 🔧 MIDDLEWARE
// ========================================

// CORS - cho phép frontend gọi API
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));

// Parse JSON body
app.use(express.json());

// Parse URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Request logger - log mọi request
app.use(requestLogger);

// ========================================
// 🏠 HEALTH CHECK ROUTES
// ========================================

app.get('/', (req, res) => {
    sendSuccess(res, {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    }, '🚀 ReviewLecturers API is running!');
});

app.get('/health', (req, res) => {
    sendSuccess(res, {
        status: 'healthy',
        database: 'connected',
        uptime: process.uptime(),
    });
});

// ========================================
// 📍 API ROUTES
// ========================================

import testRoutes from './routes/test.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import lecturerRoutes from './routes/lecturer.routes';
import academicRoutes from './routes/academic.routes';
import assignmentRoutes from './routes/assignment.routes';
import communityRoutes from './routes/community.routes';

// Auth & Admin
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Core API (Public)
app.use('/api/lecturers', lecturerRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/assignments', assignmentRoutes);

// Community (Reviews, Replies, Votes)
app.use('/api/community', communityRoutes);

// ========================================
// ⚠️ ERROR HANDLERS (Phải ở cuối cùng!)
// ========================================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ========================================
// 🚀 START SERVER
// ========================================

if (require.main === module) {
    app.listen(PORT, () => {
        console.log('========================================');
        logger.success('ReviewLecturers Backend Server Started');
        console.log('========================================');
        logger.info(`Server running on: http://localhost:${PORT}`);
        logger.info(`Database: ${process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Neon PostgreSQL'}`);
        logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('========================================');
    });
}

export default app;
