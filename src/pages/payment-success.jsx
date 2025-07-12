import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { clearCart } = useAuth(); // Assumes clearCart is available in useAuth

  useEffect(() => {
    Swal.fire({
      title: 'Payment Successful!',
      text: 'Your order has been placed successfully.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => {
      clearCart();
      navigate('/'); // Redirect to home or wherever you want
    }, 2000);
  }, [clearCart, navigate]);

  return (
    <div style={{textAlign:'center', marginTop: 80}}>
      <h2 style={{color:'#6366f1'}}>Thank you for your order!</h2>
      <p style={{color:'#666', fontSize:'1.2rem'}}>Redirecting...</p>
    </div>
  );
}
