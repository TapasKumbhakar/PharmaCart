import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { orderAPI } from '../services/api';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    const updateOrderStatus = async () => {
      try {
        // Get session ID from URL parameters (Stripe redirects with this)
        const sessionId = searchParams.get('session_id');

        // Check if this is an appointment or order payment
        const pendingOrderId = localStorage.getItem('pendingOrderId');
        const pendingOrderNumber = localStorage.getItem('pendingOrderNumber');
        const pendingAppointmentData = localStorage.getItem('pendingAppointmentData');

        if (sessionId) {
          // Fetch session details from Stripe server
          try {
            const sessionResponse = await fetch(`http://localhost:4242/checkout-session/${sessionId}`);
            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              setPaymentDetails(sessionData);
              console.log('Stripe session data:', sessionData);
            }
          } catch (error) {
            console.log('Could not fetch session details:', error);
          }
        }

        // Handle appointment payment
        if (pendingAppointmentData) {
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
              stripeSessionId: sessionId,
              createdAt: new Date().toISOString(),
              doctorName: 'Dr. Available Doctor'
            };

            // Save to localStorage
            const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
            existingAppointments.push(completedAppointment);
            localStorage.setItem('userAppointments', JSON.stringify(existingAppointments));

            // Clear pending appointment data
            localStorage.removeItem('pendingAppointmentData');

            setOrderNumber(appointmentNumber);

            Swal.fire({
              title: 'Payment Successful!',
              text: `Your appointment #${appointmentNumber} has been confirmed and scheduled.`,
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            });

          } catch (appointmentError) {
            console.error('Error processing appointment:', appointmentError);
            throw appointmentError;
          }
        }
        // Handle order payment
        else if (pendingOrderId) {
          // Update order status to 'Confirmed' and payment status to 'Paid'
          const updateResponse = await orderAPI.updateOrderStatus(pendingOrderId, {
            orderStatus: 'Confirmed',
            paymentStatus: 'Paid',
            stripeSessionId: sessionId
          });

          if (updateResponse.success) {
            setOrderNumber(pendingOrderNumber || 'N/A');

            // Clear the pending order data
            localStorage.removeItem('pendingOrderId');
            localStorage.removeItem('pendingOrderNumber');

            // Clear the cart
            localStorage.removeItem('cartItems');

            Swal.fire({
              title: 'Payment Successful!',
              text: `Your order #${pendingOrderNumber} has been confirmed and will be processed soon.`,
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            });
          } else {
            throw new Error('Failed to update order status');
          }
        } else {
          // Fallback for payments without pending data
          Swal.fire({
            title: 'Payment Successful!',
            text: 'Your payment was successful and your request has been processed.',
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        Swal.fire({
          title: 'Payment Successful!',
          text: 'Your payment was successful. Details will be updated shortly.',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        });
      }
    };

    updateOrderStatus();

    setTimeout(() => {
      navigate('/');
    }, 3000);
  }, [navigate, searchParams]);
  return (
    <div style={{textAlign:'center',marginTop:80, padding: '40px 20px'}}>
      <div style={{
        maxWidth: '500px',
        margin: '0 auto',
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <div style={{fontSize: '4rem', marginBottom: '20px'}}>✅</div>
        <h2 style={{color: '#48bb78', marginBottom: '15px'}}>Payment Successful!</h2>
        {orderNumber && (
          <p style={{fontSize: '1.1rem', marginBottom: '15px', color: '#2d3748'}}>
            Order #{orderNumber} has been confirmed
          </p>
        )}
        {paymentDetails && (
          <div style={{marginBottom: '15px', fontSize: '0.9rem', color: '#4a5568'}}>
            <p>Payment ID: {paymentDetails.payment_intent}</p>
            <p>Amount: ₹{(paymentDetails.amount_total / 100).toFixed(2)}</p>
          </div>
        )}
        <p style={{color: '#4a5568', marginBottom: '20px'}}>
          {localStorage.getItem('pendingAppointmentData') || searchParams.get('type') === 'appointment'
            ? 'Thank you for booking! Your appointment has been confirmed and you will receive further details soon.'
            : 'Thank you for your order! Your medicines will be delivered soon.'}
        </p>
        <p style={{color: '#718096', fontSize: '0.9rem'}}>
          Redirecting to home page...
        </p>
      </div>
    </div>
  );
}
