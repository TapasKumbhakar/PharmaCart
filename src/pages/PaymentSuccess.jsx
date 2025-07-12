import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    Swal.fire({
      title: 'Order Placed!',
      text: 'Your payment was successful and your order has been placed.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });
    setTimeout(() => {
      navigate('/');
    }, 2000);
  }, [navigate]);
  return (
    <div style={{textAlign:'center',marginTop:80}}>
      <h2>Thank you for your order!</h2>
      <p>Redirecting to home...</p>
    </div>
  );
}
