
import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { toggleBookmark, getMyBookmarks } from '../controllers/bookmark.controller';

const router = Router();

// Tất cả route đều cần login
router.use(authenticate);

router.post('/lecturers/:id', toggleBookmark);
router.get('/lecturers', getMyBookmarks);

export default router;
