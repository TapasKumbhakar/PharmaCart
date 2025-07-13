import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import Swal from 'sweetalert2';
import './StripeCheckout.css';

export default function StripeCheckout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    country: 'India',
    zipCode: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Get checkout data from localStorage
    const data = localStorage.getItem('stripeCheckoutData');
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      // If no checkout data, redirect back to cart
      navigate('/cart');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number
    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      if (formattedValue.length > 5) return;
    }

    // Format CVC
    if (name === 'cvc') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 4) return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumber.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    }

    if (!formData.cvc) {
      newErrors.cvc = 'CVC is required';
    } else if (formData.cvc.length < 3) {
      newErrors.cvc = 'CVC must be 3-4 digits';
    }

    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Show processing
      Swal.fire({
        title: 'Processing Payment...',
        text: 'Please wait while we process your payment.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock payment validation
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      
      if (cardNumber === '4000000000000002') {
        throw new Error('Your card was declined.');
      } else if (cardNumber === '4000000000000069') {
        throw new Error('Your card has expired.');
      }

      // Check if this is an appointment or order payment
      const pendingOrderId = localStorage.getItem('pendingOrderId');
      const pendingAppointmentData = localStorage.getItem('pendingAppointmentData');

      if (pendingAppointmentData) {
        // Handle appointment payment
        try {
          const appointmentData = JSON.parse(pendingAppointmentData);

          // Create appointment with paid status
          const appointmentId = 'APT' + Date.now();
          const appointmentNumber = 'DOC' + Math.random().toString(36).substring(2, 8).toUpperCase();

          const completedAppointment = {
            _id: appointmentId,
            appointmentNumber: appointmentNumber,
            ...appointmentData,
            appointmentStatus: 'Confirmed',
            paymentStatus: 'Paid',
            transactionId: 'stripe_' + Date.now(),
            createdAt: new Date().toISOString(),
            doctorName: 'Dr. Available Doctor'
          };

          // Save to localStorage
          const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
          existingAppointments.push(completedAppointment);
          localStorage.setItem('userAppointments', JSON.stringify(existingAppointments));

          // Clear pending appointment data
          localStorage.removeItem('pendingAppointmentData');

        } catch (appointmentError) {
          console.error('Error processing appointment:', appointmentError);
        }
      } else if (pendingOrderId) {
        // Handle order payment
        await orderAPI.updateOrderStatus(pendingOrderId, {
          orderStatus: 'Confirmed',
          paymentStatus: 'Paid',
          transactionId: 'stripe_' + Date.now()
        });
      }

      // Clear checkout data
      localStorage.removeItem('stripeCheckoutData');

      Swal.close();

      // Redirect to success page
      navigate('/payment-success');

    } catch (error) {
      Swal.close();
      
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message || 'Your payment could not be processed.',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    localStorage.removeItem('stripeCheckoutData');

    // Check if this was an appointment payment
    const pendingAppointmentData = localStorage.getItem('pendingAppointmentData');
    if (pendingAppointmentData) {
      localStorage.removeItem('pendingAppointmentData');
      navigate('/doctor-consultation');
    } else {
      navigate('/cart');
    }
  };

  if (!checkoutData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="stripe-checkout">
      <div className="stripe-header">
        <div className="stripe-logo">
          <span>🔒</span>
          <span>stripe</span>
        </div>
        <button className="close-btn" onClick={handleCancel}>×</button>
      </div>

      <div className="checkout-container">
        <div className="checkout-left">
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {checkoutData.items.map((item, index) => (
                <div key={index} className="order-item">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">×{item.quantity}</span>
                  <span className="item-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
              {checkoutData.shippingFee > 0 && (
                <div className="order-item">
                  <span className="item-name">Shipping</span>
                  <span className="item-quantity"></span>
                  <span className="item-price">₹{checkoutData.shippingFee}</span>
                </div>
              )}
            </div>
            <div className="order-total">
              <strong>Total: ₹{checkoutData.total}</strong>
            </div>
          </div>
        </div>

        <div className="checkout-right">
          <form onSubmit={handleSubmit} className="payment-form">
            <h2>Payment Details</h2>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Card Information</label>
              <div className="card-input-group">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 1234 1234 1234"
                  className={errors.cardNumber ? 'error' : ''}
                />
                <div className="card-row">
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className={errors.expiryDate ? 'error' : ''}
                  />
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="CVC"
                    className={errors.cvc ? 'error' : ''}
                  />
                </div>
              </div>
              {(errors.cardNumber || errors.expiryDate || errors.cvc) && (
                <span className="error-text">
                  {errors.cardNumber || errors.expiryDate || errors.cvc}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="Full name on card"
                className={errors.cardholderName ? 'error' : ''}
              />
              {errors.cardholderName && <span className="error-text">{errors.cardholderName}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="India">India</option>
                  <option value="USA">United States</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="400001"
                />
              </div>
            </div>

            <div className="test-cards">
              <p><strong>Test Cards:</strong></p>
              <p>✅ Success: 4242 4242 4242 4242</p>
              <p>❌ Declined: 4000 0000 0000 0002</p>
              <p>⏰ Expired: 4000 0000 0000 0069</p>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="pay-button"
            >
              {isProcessing ? 'Processing...' : `Pay ₹${checkoutData.total}`}
            </button>

            <div className="secure-info">
              <span>🔒</span>
              <span>Your payment information is secure and encrypted</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
