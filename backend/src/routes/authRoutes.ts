// backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// POST /api/auth/register - Requires no token (anonymous registration attempt)
router.post('/register', registerUser);

// POST /api/auth/login - Requires no token
router.post('/login', loginUser);

// GET /api/auth/me - Requires a valid Bearer Token
router.get('/me', authenticateToken, getMe); 

export default router;