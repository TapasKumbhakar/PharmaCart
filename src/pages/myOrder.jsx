import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './myOrder.css'; // Optional: For custom styling
import paracetamolImg from '../assets/medicines/paracetamol-500-mg-tablet.png';
import dolo650Img from '../assets/medicines/dolo-paracetamol-650mg.webp';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({});
  const { isLoggedIn, user } = useAuth();

  // Debug authentication state
  useEffect(() => {
    console.log('MyOrders - Auth state:', { isLoggedIn, user });
    console.log('MyOrders - localStorage userData:', localStorage.getItem('userData'));
  }, [isLoggedIn, user]);

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      // Check multiple authentication sources
      const hasStoredUser = localStorage.getItem('userData');
      const isAuthenticated = isLoggedIn || !!hasStoredUser;

      console.log('MyOrders fetchOrders - isLoggedIn:', isLoggedIn, 'hasStoredUser:', !!hasStoredUser, 'isAuthenticated:', isAuthenticated);

      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await orderAPI.getUserOrders();
        if (response && response.success) {
          console.log('Loaded orders from API:', response.orders.length);
          setOrders(response.orders);
        } else {
          throw new Error('API response failed');
        }
      } catch (error) {
        console.error('API failed, loading from localStorage:', error);

        // Fallback to localStorage - check both possible keys
        let localOrders = [];

        // Try the main orders key first
        const userOrders = localStorage.getItem('user_orders');
        if (userOrders) {
          try {
            localOrders = JSON.parse(userOrders);
            console.log('Loaded orders from user_orders:', localOrders.length);
          } catch (parseError) {
            console.error('Error parsing user_orders:', parseError);
          }
        }

        // If no orders found, try the alternative key
        if (localOrders.length === 0) {
          const userOrdersAlt = localStorage.getItem('userOrders');
          if (userOrdersAlt) {
            try {
              localOrders = JSON.parse(userOrdersAlt);
              console.log('Loaded orders from userOrders:', localOrders.length);
            } catch (parseError) {
              console.error('Error parsing userOrders:', parseError);
            }
          }
        }

        // Sort orders by creation date (newest first)
        if (localOrders.length > 0) {
          localOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setOrders(localOrders);
          console.log('Successfully loaded', localOrders.length, 'orders from localStorage');
        } else {
          console.log('No orders found in localStorage');
          setOrders([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

  // Manual refresh function
  const handleRefresh = async () => {
    setLoading(true);

    // Force reload from localStorage
    let localOrders = [];

    // Try the main orders key first
    const userOrders = localStorage.getItem('user_orders');
    if (userOrders) {
      try {
        localOrders = JSON.parse(userOrders);
        console.log('Refreshed orders from user_orders:', localOrders.length);
      } catch (parseError) {
        console.error('Error parsing user_orders:', parseError);
      }
    }

    // If no orders found, try the alternative key
    if (localOrders.length === 0) {
      const userOrdersAlt = localStorage.getItem('userOrders');
      if (userOrdersAlt) {
        try {
          localOrders = JSON.parse(userOrdersAlt);
          console.log('Refreshed orders from userOrders:', localOrders.length);
        } catch (parseError) {
          console.error('Error parsing userOrders:', parseError);
        }
      }
    }

    // Sort orders by creation date (newest first)
    if (localOrders.length > 0) {
      localOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(localOrders);

      Swal.fire({
        icon: 'success',
        title: 'Orders Refreshed!',
        text: `Found ${localOrders.length} orders`,
        timer: 1500,
        showConfirmButton: false
      });
    } else {
      setOrders([]);
      Swal.fire({
        icon: 'info',
        title: 'No Orders Found',
        text: 'You haven\'t placed any orders yet.',
        timer: 1500,
        showConfirmButton: false
      });
    }

    setLoading(false);
  };

  const handleCancel = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Cancel Order?',
        text: 'Are you sure you want to cancel this order?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, cancel it!'
      });

      if (result.isConfirmed) {
        const response = await orderAPI.cancelOrder(orderId);
        if (response.success) {
          // Update the order in the local state
          setOrders(orders.map(order =>
            order._id === orderId
              ? { ...order, orderStatus: 'Cancelled' }
              : order
          ));

          Swal.fire({
            icon: 'success',
            title: 'Order Cancelled',
            text: 'Your order has been cancelled successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Cancellation Failed',
        text: error.message || 'Failed to cancel order. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleReturn = (orderId) => {
    Swal.fire({
      icon: 'info',
      title: 'Return Request',
      text: 'Return functionality will be available soon. Please contact customer support.',
      timer: 2000,
      showConfirmButton: false
    });
  };

  const handleRemove = async (orderId) => {
    try {
      const result = await Swal.fire({
        title: 'Remove Order?',
        text: 'This will permanently delete this order from your records. This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, remove it!',
        cancelButtonText: 'Keep it'
      });

      if (result.isConfirmed) {
        // Remove from local state
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);

        // Update localStorage
        localStorage.setItem('userOrders', JSON.stringify(updatedOrders));

        Swal.fire({
          icon: 'success',
          title: 'Order Removed',
          text: 'The order has been permanently removed from your records.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Remove order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Removal Failed',
        text: 'Failed to remove order. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  // Check authentication from multiple sources
  const hasStoredUser = localStorage.getItem('userData');
  const isAuthenticated = isLoggedIn || !!hasStoredUser;

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="page-header">
            <h1>My Orders</h1>
            <p>Track and manage your medicine orders</p>
          </div>
          <div className="empty-state">
            <div className="empty-icon">🔐</div>
            <h3>Please Log In</h3>
            <p>You need to be logged in to view your orders.</p>
            <button className="login-btn" onClick={() => window.location.href = '/login'}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="page-header">
            <h1>My Orders</h1>
            <p>Track and manage your medicine orders</p>
          </div>
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Loading Your Orders</h3>
            <p>Please wait while we fetch your order history...</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    if (!status) return '📋';
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'processing': return '📦';
      case 'shipped': return '🚚';
      case 'delivered': return '🎉';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    if (!status) return '#6b7280';
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#10b981';
      case 'processing': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="page-header">
          <div className="header-content">
            <div className="header-text">
              <h1>My Orders</h1>
              <p>Track and manage your medicine orders</p>
            </div>
            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={loading}
              title="Refresh orders"
            >
              <span className="refresh-icon">🔄</span>
              Refresh
            </button>
          </div>
          <div className="orders-stats">
            <div className="stat-item">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Orders</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orders.filter(o => o.orderStatus && o.orderStatus === 'Delivered').length}</span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{orders.filter(o => o.orderStatus && !['Delivered', 'Cancelled'].includes(o.orderStatus)).length}</span>
              <span className="stat-label">Active</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping for medicines!</p>
            <button className="shop-now-btn" onClick={() => window.location.href = '/Card-Container'}>
              Shop Now
            </button>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="enhanced-order-card">
                <div className="order-card-header">
                  <div className="order-info">
                    <h3>Order #{order.orderNumber}</h3>
                    <p className="order-date">
                      📅 {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="order-status-badge" style={{ backgroundColor: getStatusColor(order.orderStatus || 'pending') }}>
                    <span className="status-icon">{getStatusIcon(order.orderStatus || 'pending')}</span>
                    <span className="status-text">{order.orderStatus || 'Pending'}</span>
                  </div>
                </div>

                <div className="order-items-section">
                  <h4>Items Ordered ({order.items ? order.items.length : 0})</h4>
                  <div className="order-items-grid">
                    {(order.items || []).map((item, index) => (
                      <div key={index} className="enhanced-order-item">
                        <div className="item-image-container">
                          <img
                            src={item.image || paracetamolImg}
                            alt={item.name}
                            className="item-image"
                          />
                        </div>
                        <div className="item-details">
                          <h5 className="item-name">{item.name || 'Unknown Item'}</h5>
                          <div className="item-meta">
                            <span className="item-quantity">Qty: {item.quantity || 1}</span>
                            <span className="item-price">₹{item.price || '0'}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="order-summary">
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">💰 Total Amount</span>
                      <span className="summary-value">₹{order.totalAmount || '0'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">💳 Payment Method</span>
                      <span className="summary-value">{order.paymentMethod || 'Not specified'}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">📊 Payment Status</span>
                      <span className={`payment-status ${order.paymentStatus ? order.paymentStatus.toLowerCase() : 'pending'}`}>
                        {order.paymentStatus || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-actions-section">
                  <div className="action-buttons">
                    {order.orderStatus && !['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                      <button className="cancel-btn" onClick={() => handleCancel(order._id)}>
                        <span className="btn-icon">❌</span>
                        Cancel Order
                      </button>
                    )}
                    {order.orderStatus === 'Delivered' && (
                      <button className="return-btn" onClick={() => handleReturn(order._id)}>
                        <span className="btn-icon">↩️</span>
                        Return
                      </button>
                    )}
                    <button className="track-btn">
                      <span className="btn-icon">📍</span>
                      Track Order
                    </button>
                    <button className="remove-btn" onClick={() => handleRemove(order._id)}>
                      <span className="btn-icon">🗑️</span>
                      Remove
                    </button>
                  </div>

                  {order.orderStatus === 'Delivered' && (
                    <div className="rating-section">
                      <span className="rating-label">Rate your experience:</span>
                      <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => handleRating(order._id, star)}
                            className={`rating-star ${ratings[order._id] >= star ? 'filled' : ''}`}
                          >
                            ⭐
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

