import express from 'express';
import { adminDashbord } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/dashboard', requireAuth, requireRole('admin'), adminDashbord);

export default router;
