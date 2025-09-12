import express from 'express';
import { promoteUser, listUsers, updateUserRole } from '../controllers/adminController.js';
import { protect, isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// POST /api/admin/promote { email | userId }
router.post('/promote', protect, isAdmin, promoteUser);

// GET /api/admin/users
router.get('/users', protect, isAdmin, listUsers);

// PUT /api/admin/users/:id/role
router.put('/users/:id/role', protect, isAdmin, updateUserRole);

export default router;
