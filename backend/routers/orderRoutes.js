const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  adminUpdateOrder
} = require('../controller/orderController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// User routes
router.post('/', createOrder);
router.get('/my-orders', getUserOrders);
router.get('/:orderId', getOrder);
router.put('/:orderId/cancel', cancelOrder);

// Admin routes
router.get('/admin/all', getAllOrders);
router.put('/admin/:orderId/update', adminUpdateOrder);
router.put('/:orderId/status', updateOrderStatus);

module.exports = router;
