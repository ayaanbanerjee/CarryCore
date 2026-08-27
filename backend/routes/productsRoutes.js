import express from 'express';
import {
    createProduct, 
    getProducts,
    getProductById,
    updateProduct, 
    deleteProduct
} from '../controllers/productController.js';
import { requireAuth, requireRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin only routes
router.post('/add', requireAuth, requireRole('admin'), createProduct);
router.put('/update/:id', requireAuth, requireRole('admin'), updateProduct);
router.delete('/delete/:id', requireAuth, requireRole('admin'), deleteProduct);

export default router;
