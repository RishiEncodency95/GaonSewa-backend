import express from 'express';
import { 
    createOrder, 
    updateOrderStatus, 
    getMyOrders, 
    getCompanyOrders 
} from '../controllers/orderController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Customer routes
router.post('/', createOrder);
router.get('/my-orders', getMyOrders);

// Admin/Staff routes
router.get('/company-orders', restrictTo('orders', 'read'), getCompanyOrders);
router.patch('/:id/status', restrictTo('orders', 'write'), updateOrderStatus);

export default router;
