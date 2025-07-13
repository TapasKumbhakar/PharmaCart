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
  const { isLoggedIn } = useAuth();

  // Fetch user orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isLoggedIn) {
        setLoading(false);
        return;
      }

      try {
        const response = await orderAPI.getUserOrders();
        if (response.success) {
          setOrders(response.orders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to load orders',
          text: error.message || 'Could not load your orders. Please try again.',
          timer: 2000,
          showConfirmButton: false
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isLoggedIn]);

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

  const handleRating = (id, rating) => {
    setRatings({ ...ratings, [id]: rating });
  };

  if (!isLoggedIn) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Please log in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-container">
        <h1>My Orders</h1>
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order.orderNumber}</h3>
              <span className={`order-status ${order.orderStatus.toLowerCase()}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={item.image || paracetamolImg}
                    alt={item.name}
                    className="order-item-image"
                  />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-details">
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>

              <div className="order-actions">
                {!['Delivered', 'Cancelled'].includes(order.orderStatus) && (
                  <button onClick={() => handleCancel(order._id)}>Cancel Order</button>
                )}
                {order.orderStatus === 'Delivered' && (
                  <button onClick={() => handleReturn(order._id)}>Return</button>
                )}
              </div>

              <div className="rating-section">
                <span>Rate Order: </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleRating(order._id, star)}
                    style={{
                      cursor: 'pointer',
                      color: ratings[order._id] >= star ? '#FFD700' : '#ccc',
                      fontSize: '20px',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

