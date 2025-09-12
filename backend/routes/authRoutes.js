import express from 'express';
import { register, login, dashboard, logout } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public
router.post('/signup', register);
router.post('/login', login);

// Protected
router.get('/dashboard', protect, dashboard);

// Logout
router.post('/logout', logout);

export default router;
