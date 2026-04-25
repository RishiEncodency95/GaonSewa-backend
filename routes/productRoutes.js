import express from 'express';
import { 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (e.g., for the public dairy app)
router.get('/', getAllProducts);

// Protected routes (Admin/Staff only)
router.use(protect);

router.post('/', restrictTo('inventory', 'write'), createProduct);
router.patch('/:id', restrictTo('inventory', 'write'), updateProduct);
router.delete('/:id', restrictTo('inventory', 'write'), deleteProduct);

export default router;
