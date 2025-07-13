const Order = require('../models/Order');
const User = require('../models/User');

// Create new order
const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      shippingFee = 0,
      paymentMethod,
      shippingAddress,
      stripeSessionId
    } = req.body;

    const orderCount = await Order.countDocuments();
    const orderNumber = `ORD${Date.now()}${orderCount + 1}`;

    const order = new Order({
      userId: req.userId,
      orderNumber,
      items,
      totalAmount,
      shippingFee,
      paymentMethod,
      shippingAddress,
      stripeSessionId,
      paymentStatus: paymentMethod === 'Online Payment' ? 'Paid' : 'Pending'
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      details: error.message
    });
  }
};


// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email');

    const totalOrders = await Order.countDocuments({ userId: req.userId });

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders',
      details: error.message
    });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.userId 
    }).populate('userId', 'fullname email');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get order',
      details: error.message
    });
  }
};

// Update order status (for admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, trackingNumber, deliveryDate, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        orderStatus, 
        trackingNumber, 
        deliveryDate, 
        notes,
        ...(orderStatus === 'Delivered' && { paymentStatus: 'Paid' })
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      details: error.message
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ 
      _id: orderId, 
      userId: req.userId 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if order can be cancelled
    if (['Shipped', 'Delivered', 'Cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled at this stage'
      });
    }

    order.orderStatus = 'Cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      details: error.message
    });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    const filter = status ? { orderStatus: status } : {};

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'fullname email mobile');

    const totalOrders = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNext: page < Math.ceil(totalOrders / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get orders',
      details: error.message
    });
  }
};

// Admin: Update order status and manage orders
const adminUpdateOrder = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.type !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin privileges required.'
      });
    }

    const { orderId } = req.params;
    const { orderStatus, trackingNumber, deliveryDate, notes } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        orderStatus,
        trackingNumber,
        deliveryDate,
        notes,
        ...(orderStatus === 'Delivered' && { paymentStatus: 'Paid' })
      },
      { new: true }
    ).populate('userId', 'fullname email mobile');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order updated successfully',
      order
    });

  } catch (error) {
    console.error('Admin update order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order',
      details: error.message
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getAllOrders,
  adminUpdateOrder
};
