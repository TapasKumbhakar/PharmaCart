import React from 'react';
import { useAuth } from '../context/AuthContext';
import { stripePromise } from '../stripe';
import { orderAPI } from '../services/api';
import AddressSelector from '../components/AddressSelector';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './cart.css';

export default function Cart({ cartItems = [], removeFromCart, increaseQuantity, decreaseQuantity, clearCart }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = React.useState(null);
  const [payment, setPayment] = React.useState('');

  // Handle Stripe Payment (Mock implementation for demo)
  const handleStripePayment = async () => {
    try {
      // Show Stripe-like loading message
      Swal.fire({
        title: 'Redirecting to Stripe...',
        text: 'Please wait while we redirect you to Stripe Checkout.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate Stripe checkout session creation
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock Stripe checkout data
      const checkoutData = {
        sessionId: 'cs_test_' + Math.random().toString(36).substr(2, 9),
        items: cartItems.map(item => ({
          name: item.name,
          price: typeof item.price === 'string' ?
            parseFloat(item.price.replace(/[₹\s]/g, '')) :
            parseFloat(item.price) || 0,
          quantity: item.quantity || 1
        })),
        total: total,
        shippingFee: shippingFee || 0
      };

      // Store checkout data for the mock Stripe page
      localStorage.setItem('stripeCheckoutData', JSON.stringify(checkoutData));

      // Close loading and redirect to mock Stripe checkout
      Swal.close();

      // Redirect to mock Stripe checkout page
      window.location.href = '/stripe-checkout';

    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: 'Unable to process payment. Please try again.',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const price = cartItems.reduce((sum, item) => {
    let itemPrice = 0;
    if (typeof item.price === 'string') {
      const match = item.price.match(/(\d+)/);
      if (match) itemPrice = Number(match[1]);
    } else if (typeof item.price === 'number') {
      itemPrice = item.price;
    }
    const itemQty = Number(item.quantity);
    if (!isNaN(itemPrice) && !isNaN(itemQty)) {
      return sum + (itemPrice * itemQty);
    }
    return sum;
  }, 0);

  const shippingFee = price > 0 && price < 499 ? 40 : 0;
  const total = price + shippingFee;

  const handlePlaceOrder = async () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You must be logged in to place an order.',
        timer: 1800,
        showConfirmButton: false
      });
      setTimeout(() => {
        navigate('/login');
      }, 1800);
      return;
    }

    if (!selectedAddress) {
      Swal.fire({
        icon: 'warning',
        title: 'Select Delivery Address',
        text: 'Please select a delivery address to continue.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id || item.name,
          name: item.name,
          price: typeof item.price === 'string' ?
            (item.price.match(/(\d+)/) ? Number(item.price.match(/(\d+)/)[1]) : 0) :
            item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: total,
        shippingFee: shippingFee,
        paymentMethod: payment,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          phone: selectedAddress.phone,
          street: selectedAddress.street,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          country: selectedAddress.country,
          type: selectedAddress.type
        }
      };

      if (payment === 'Cash On Delivery') {
        // Save order to database
        const response = await orderAPI.createOrder(orderData);

        if (response.success) {
          Swal.fire({
            title: 'Order Placed!',
            text: `Your order #${response.order.orderNumber} has been placed successfully. Redirecting to home page...`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            clearCart && clearCart();
            navigate('/');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Order placement error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.message || 'Failed to place order. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  return (
    <div className="cart-order-box">
      <h2 style={{ color: '#3b3b3b', marginBottom: 24, textAlign: 'center' }}>Your Cart & Order Summary</h2>
      {cartItems.length === 0 ? (
        <>
          <div style={{ textAlign: 'center', marginTop: 32, marginBottom: 16 }}>
            <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: 16 }}>🙂</span>
            <h3 style={{ color: '#6366f1', fontWeight: 800, fontSize: '2rem', marginBottom: 12 }}>Your cart is empty!</h3>
            <p style={{ color: '#666', fontSize: '1.25rem', marginBottom: 24 }}>Looks like you haven't added anything yet.<br />Start exploring and add your favorite medicines!</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <button
              style={{
                background: 'linear-gradient(90deg,#6366f1 60%,#0fe3ab 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '7px',
                fontSize: '16px',
                fontWeight: 600,
                padding: '12px 32px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(99,102,241,0.09)',
                transition: 'background 0.2s'
              }}
              onClick={() => navigate('/Card-Container')}
            >
              Explore Medicine
            </button>
          </div>
        </>
      ) : (
        <div className="cart-order-content">
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-list-item">
                <img src={item.img} alt={item.name} className="cart-list-img" />
                <div className="cart-list-details">
                  <span className="cart-list-name">{item.name}</span>
                  <span className="cart-list-price">{item.price}</span>
                  <div className="cart-list-desc">{item.desc}</div>
                </div>
                <div className="cart-list-qty-controls">
                  <button className="product-qty-btn" onClick={() => decreaseQuantity && decreaseQuantity(item.id)}>-</button>
                  <span className="product-qty-value">{item.quantity}</span>
                  <button
                    className={`product-qty-btn plus ${item.quantity >= 50 ? 'disabled' : ''}`}
                    onClick={() => item.quantity < 50 && increaseQuantity && increaseQuantity(item.id)}
                    disabled={item.quantity >= 50}
                    title={item.quantity >= 50 ? 'Maximum quantity reached (50)' : 'Increase quantity'}
                  >
                    +
                  </button>
                  {item.quantity >= 50 && (
                    <div className="quantity-limit-indicator">
                      <span style={{ color: '#f59e0b', fontSize: '0.8rem', marginLeft: '8px' }}>
                        Max limit
                      </span>
                    </div>
                  )}
                </div>
                <button className="cart-list-remove" onClick={() => removeFromCart && removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          {/* Address Selection */}
          <AddressSelector
            onAddressSelect={setSelectedAddress}
            selectedAddressId={selectedAddress?.id}
            showAddForm={true}
          />

          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <hr />
            <div className="order-summary-section">
              <div className="order-summary-label">PAYMENT METHOD</div>
              <select className="order-summary-select" value={payment} onChange={e => setPayment(e.target.value)}>
                <option value="" disabled>Select Payment Method</option>
                <option>Cash On Delivery</option>
                <option>Online Payment</option>
              </select>
            </div>
            <div className="order-summary-section">
              <div className="order-summary-row"><span>Price</span><span>{price > 0 ? price : 0}</span></div>
              <div className="order-summary-row">
                <span>Shipping Fee</span>
                {shippingFee === 0 ? (
                  <span style={{ color: '#059669' }}>Free</span>
                ) : (
                  <span style={{ color: '#000' }}>₹{shippingFee}</span>
                )}
              </div>
              {price > 0 && price < 499 && (
                <div style={{
                  marginTop: '8px',
                  background: 'linear-gradient(90deg,#6366f1 60%,#0fe3ab 100%)',
                  color: '#fff',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontWeight: '500',
                  fontSize: '1rem',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.09)'
                }}>
                  <span role="img" aria-label="delivery">🚚</span> Oops! Only ₹{499 - price} left to get <span style={{ fontWeight: 600 }}>Free Delivery</span>!
                </div>
              )}
              <div className="order-summary-row order-summary-total"><span>Total Amount:</span><span>{price > 0 ? total : 0}</span></div>
            </div>

            {payment === 'Cash On Delivery' ? (
              <button className="order-summary-place" onClick={handlePlaceOrder}>Place Order</button>
            ) : (
              <button className="order-summary-place" onClick={async () => {
                if (!isLoggedIn) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Please log in',
                    text: 'You must be logged in to place an order.',
                    timer: 1800,
                    showConfirmButton: false
                  });
                  setTimeout(() => {
                    navigate('/login');
                  }, 1800);
                  return;
                }

                if (!selectedAddress) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Select Delivery Address',
                    text: 'Please select a delivery address to continue.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                  return;
                }

                if (!payment) {
                  Swal.fire({
                    icon: 'warning',
                    title: 'Select a payment method',
                    text: 'Please select a payment method before proceeding.',
                    timer: 1800,
                    showConfirmButton: false
                  });
                  return;
                }

                // Create order first, then process Stripe payment
                const orderData = {
                  items: cartItems.map(item => ({
                    name: item.name,
                    quantity: item.quantity || 1,
                    price: typeof item.price === 'string' ?
                      parseFloat(item.price.replace(/[₹\s]/g, '')) :
                      parseFloat(item.price) || 0
                  })),
                  totalAmount: total,
                  shippingAddress: {
                    fullName: selectedAddress.fullName,
                    phone: selectedAddress.phone,
                    street: selectedAddress.street,
                    city: selectedAddress.city,
                    state: selectedAddress.state,
                    zipCode: selectedAddress.zipCode,
                    country: selectedAddress.country,
                    type: selectedAddress.type
                  },
                  paymentMethod: 'Online Payment',
                  paymentStatus: 'Pending'
                };

                try {
                  const orderResponse = await orderAPI.createOrder(orderData);

                  if (orderResponse.success) {
                    // Store order ID for payment success page
                    localStorage.setItem('pendingOrderId', orderResponse.order._id);
                    localStorage.setItem('pendingOrderNumber', orderResponse.order.orderNumber);

                    // Show processing message and redirect to Stripe
                    Swal.fire({
                      title: 'Redirecting to Payment...',
                      text: 'Please wait while we redirect you to secure payment.',
                      icon: 'info',
                      timer: 2000,
                      showConfirmButton: false
                    });

                    // Process Stripe payment
                    setTimeout(() => {
                      handleStripePayment();
                    }, 2000);
                  } else {
                    throw new Error(orderResponse.error || 'Failed to create order');
                  }
                } catch (error) {
                  console.error('Order creation error:', error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Order Failed',
                    text: 'Failed to create order. Please try again.',
                    timer: 2000,
                    showConfirmButton: false
                  });
                }
              }}>
                Pay Now
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
