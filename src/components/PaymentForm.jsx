import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './PaymentForm.css';

export default function PaymentForm({ onPaymentSuccess, onCancel, orderTotal }) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('billing.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [field]: value
        }
      }));
    } else {
      let formattedValue = value;
      
      // Format card number with spaces
      if (name === 'cardNumber') {
        formattedValue = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
        if (formattedValue.length > 19) return; // Limit to 16 digits + 3 spaces
      }
      
      // Format expiry date
      if (name === 'expiryDate') {
        formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
        if (formattedValue.length > 5) return; // Limit to MM/YY
      }
      
      // Format CVV
      if (name === 'cvv') {
        formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length > 4) return; // Limit to 4 digits
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
    }
    
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
    
    // Card number validation
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    // Expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid expiry date format (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3-4 digits';
    }
    
    // Cardholder name validation
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }
    
    // Billing address validation
    if (!formData.billingAddress.street.trim()) {
      newErrors['billing.street'] = 'Billing address is required';
    }
    if (!formData.billingAddress.city.trim()) {
      newErrors['billing.city'] = 'City is required';
    }
    if (!formData.billingAddress.state.trim()) {
      newErrors['billing.state'] = 'State is required';
    }
    if (!formData.billingAddress.zipCode.trim()) {
      newErrors['billing.zipCode'] = 'ZIP code is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5') || number.startsWith('2')) return 'Mastercard';
    if (number.startsWith('3')) return 'American Express';
    return 'Unknown';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Information',
        text: 'Please correct the errors and try again.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Show processing message
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
      
      // Simulate payment processing (2-3 seconds)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment validation
      const cardNumber = formData.cardNumber.replace(/\s/g, '');
      
      // Simulate different outcomes based on card number
      if (cardNumber === '4000000000000002') {
        throw new Error('Card declined');
      } else if (cardNumber === '4000000000000069') {
        throw new Error('Expired card');
      } else if (cardNumber === '4000000000000119') {
        throw new Error('Processing error');
      }
      
      // Simulate successful payment
      Swal.close();
      
      Swal.fire({
        icon: 'success',
        title: 'Payment Successful!',
        text: `₹${orderTotal} has been charged to your ${getCardType(formData.cardNumber)} card ending in ${cardNumber.slice(-4)}.`,
        timer: 3000,
        showConfirmButton: false
      });
      
      // Call success callback
      setTimeout(() => {
        onPaymentSuccess({
          transactionId: 'TXN' + Date.now(),
          cardType: getCardType(formData.cardNumber),
          lastFourDigits: cardNumber.slice(-4),
          amount: orderTotal
        });
      }, 3000);
      
    } catch (error) {
      Swal.close();
      
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        text: error.message || 'Unable to process payment. Please try again.',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-form-overlay">
      <div className="payment-form-container">
        <div className="payment-form-header">
          <h2>Payment Details</h2>
          <div className="payment-amount">
            Total: ₹{orderTotal}
          </div>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="payment-form">
          {/* Card Information */}
          <div className="form-section">
            <h3>Card Information</h3>
            
            <div className="form-group">
              <label>Card Number *</label>
              <div className="card-input-container">
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className={errors.cardNumber ? 'error' : ''}
                />
                <div className="card-type">{getCardType(formData.cardNumber)}</div>
              </div>
              {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Expiry Date *</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={errors.expiryDate ? 'error' : ''}
                />
                {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
              </div>
              
              <div className="form-group">
                <label>CVV *</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className={errors.cvv ? 'error' : ''}
                />
                {errors.cvv && <span className="error-message">{errors.cvv}</span>}
              </div>
            </div>
            
            <div className="form-group">
              <label>Cardholder Name *</label>
              <input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="John Doe"
                className={errors.cardholderName ? 'error' : ''}
              />
              {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
            </div>
          </div>
          
          {/* Billing Address */}
          <div className="form-section">
            <h3>Billing Address</h3>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                name="billing.street"
                value={formData.billingAddress.street}
                onChange={handleInputChange}
                placeholder="123 Main Street"
                className={errors['billing.street'] ? 'error' : ''}
              />
              {errors['billing.street'] && <span className="error-message">{errors['billing.street']}</span>}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="billing.city"
                  value={formData.billingAddress.city}
                  onChange={handleInputChange}
                  placeholder="Mumbai"
                  className={errors['billing.city'] ? 'error' : ''}
                />
                {errors['billing.city'] && <span className="error-message">{errors['billing.city']}</span>}
              </div>
              
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="billing.state"
                  value={formData.billingAddress.state}
                  onChange={handleInputChange}
                  placeholder="Maharashtra"
                  className={errors['billing.state'] ? 'error' : ''}
                />
                {errors['billing.state'] && <span className="error-message">{errors['billing.state']}</span>}
              </div>
              
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="billing.zipCode"
                  value={formData.billingAddress.zipCode}
                  onChange={handleInputChange}
                  placeholder="400001"
                  className={errors['billing.zipCode'] ? 'error' : ''}
                />
                {errors['billing.zipCode'] && <span className="error-message">{errors['billing.zipCode']}</span>}
              </div>
            </div>
          </div>
          
          {/* Test Cards Info */}
          <div className="test-cards-info">
            <h4>Test Cards (for demo):</h4>
            <p>✅ Success: 4242 4242 4242 4242</p>
            <p>❌ Declined: 4000 0000 0000 0002</p>
            <p>⏰ Expired: 4000 0000 0000 0069</p>
          </div>
          
          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isProcessing} className="pay-btn">
              {isProcessing ? 'Processing...' : `Pay ₹${orderTotal}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
