import React from 'react';
import { useAuth } from '../context/AuthContext';
import { stripePromise } from '../stripe';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import './cart.css';

export default function Cart({ cartItems = [], removeFromCart, increaseQuantity, decreaseQuantity, clearCart }) {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [address, setAddress] = React.useState('No address found');
  const [payment, setPayment] = React.useState('');

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

  const handlePlaceOrder = () => {
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
    if (payment === 'Cash On Delivery') {
      Swal.fire({
        title: 'Order Placed!',
        text: 'Your order has been placed successfully.',
        icon: 'success',
        timer: 1800,
        showConfirmButton: false
      });
      setTimeout(() => {
        clearCart && clearCart();
        navigate('/');
      }, 2000);
    }

    else if (payment === 'Online Payment') {
      Swal.fire({
        title: 'Redirecting to payment gateway...',
        text: 'Please wait while we process your payment.',
        icon: 'info',
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      setTimeout(() => {
        clearCart && clearCart();
        navigate('/');
      }, 2000);
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
                  <button className="product-qty-btn plus" onClick={() => increaseQuantity && increaseQuantity(item.id)}>+</button>
                </div>
                <button className="cart-list-remove" onClick={() => removeFromCart && removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="order-summary-box">
            <h3>Order Summary</h3>
            <hr />
            <div className="order-summary-section">
              <div className="order-summary-label">DELIVERY ADDRESS</div>
              <div className="order-summary-row">
                <span className="order-summary-address">{address}</span>
                <button className="order-summary-change" onClick={() => setAddress('Address updated!')}>Change</button>
              </div>
            </div>
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

                const stripe = await stripePromise;
                const response = await fetch('http://localhost:4242/create-checkout-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ cartItems, shippingFee })
                });

                const session = await response.json();

                if (session.id) {

                  // ✅ Background: Clear cart after 4 seconds, with debug log
                  setTimeout(() => {
                    if (clearCart) {
                      clearCart();
                      console.log('clearCart called!');
                      setTimeout(() => {
                        console.log('Cart after clearCart:', localStorage.getItem('pharmacart_cart'));
                      }, 100);
                    }
                  }, 4000);

                  // 🚀 Redirect immediately
                  await stripe.redirectToCheckout({ sessionId: session.id });
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Payment Error',
                    text: 'Could not initiate payment. Please try again.',
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
