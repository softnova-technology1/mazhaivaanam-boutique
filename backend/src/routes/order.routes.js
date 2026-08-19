import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import validate from '../middleware/validate.middleware.js';
import { createOrderValidator } from '../validators/order.validator.js';
import {
  createOrder, verifyPayment, getUserOrders,
  getOrderById, cancelOrder, trackOrder,
} from '../controllers/order.controller.js';

const router = Router();

// Order tracking — public
router.get('/tracking/:orderId', trackOrder);

// Protected routes
router.post('/', protect, validate(createOrderValidator), createOrder);
router.get('/', protect, getUserOrders);
router.get('/:orderId', protect, getOrderById);
router.post('/:orderId/cancel', protect, cancelOrder);

// Payment verification
router.post('/payments/verify', protect, verifyPayment);

export default router;
