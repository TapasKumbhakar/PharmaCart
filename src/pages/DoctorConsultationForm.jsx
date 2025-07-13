
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { stripePromise } from '../stripe';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './DoctorConsultationForm.css';

export default function DoctorConsultationForm() {
  const [form, setForm] = useState({
    patientName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    consultationType: '',
    preferredDate: '',
    symptoms: '',
    attachReports: null,
  });
  // Doctor selection removed as per request
  const [payment, setPayment] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const consultationFee = 300;

  const handleChange = e => {
    const { name, value, type, files } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Debug: Check authentication status
    console.log('isLoggedIn:', isLoggedIn);
    console.log('authToken:', localStorage.getItem('authToken'));
    console.log('userData:', localStorage.getItem('userData'));

    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You must be logged in to book an appointment.',
        timer: 1800,
        showConfirmButton: false
      });
      setTimeout(() => navigate('/login'), 1800);
      return;
    }

    if (!payment) {
      Swal.fire({ icon: 'warning', title: 'Select payment method', text: 'Please select a payment method.', timer: 1800, showConfirmButton: false });
      return;
    }

    setLoading(true);

    try {
      // Prepare appointment data
      const appointmentData = {
        patientName: form.patientName,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dob,
        gender: form.gender,
        consultationType: form.consultationType,
        preferredDate: form.preferredDate,
        symptoms: form.symptoms,
        consultationFee: consultationFee,
        paymentMethod: payment,
        attachedReports: form.attachReports?.name || null
      };

      if (payment === 'Offline Payment / CASH') {
        try {
          // Save appointment to database
          console.log('Sending appointment data:', appointmentData);
          const response = await appointmentAPI.createAppointment(appointmentData);
          console.log('Appointment response:', response);

          if (response && response.success) {
            // Save to localStorage as well
            const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
            existingAppointments.push(response.appointment);
            localStorage.setItem('userAppointments', JSON.stringify(existingAppointments));

            Swal.fire({
              title: 'Appointment Booked!',
              text: `Your consultation #${response.appointment.appointmentNumber} has been booked successfully.`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            setTimeout(() => navigate('/my-appointments'), 2000);
          } else {
            throw new Error(response?.message || 'Failed to book appointment');
          }
        } catch (apiError) {
          console.error('API Error:', apiError);

          // Save appointment to localStorage as fallback
          const appointmentId = 'APT' + Date.now();
          const appointmentNumber = 'DOC' + Math.random().toString(36).substring(2, 8).toUpperCase();

          const localAppointment = {
            _id: appointmentId,
            appointmentNumber: appointmentNumber,
            ...appointmentData,
            appointmentStatus: 'Pending',
            paymentStatus: payment === 'Offline Payment / CASH' ? 'Pending' : 'Paid',
            createdAt: new Date().toISOString(),
            doctorName: 'Dr. Available Doctor' // Placeholder
          };

          // Get existing appointments from localStorage
          const existingAppointments = JSON.parse(localStorage.getItem('userAppointments') || '[]');
          existingAppointments.push(localAppointment);
          localStorage.setItem('userAppointments', JSON.stringify(existingAppointments));

          Swal.fire({
            title: 'Appointment Submitted!',
            text: `Your appointment #${appointmentNumber} has been submitted. We will contact you soon to confirm.`,
            icon: 'success',
            timer: 3000,
            showConfirmButton: false
          });
          setTimeout(() => navigate('/my-appointments'), 3000);
        }
      } else if (payment === 'Online Payment') {
        try {
          // Save appointment data to localStorage before payment
          localStorage.setItem('pendingAppointmentData', JSON.stringify(appointmentData));

          Swal.fire({
            title: 'Redirecting to payment gateway...',
            text: 'Please wait while we process your payment.',
            icon: 'info',
            timer: 1800,
            showConfirmButton: false
          });

          setTimeout(async () => {
            try {
              const stripe = await stripePromise;

              // Create checkout session with real Stripe
              const response = await fetch('http://localhost:4242/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  cartItems: [{
                    name: `Doctor Consultation - ${appointmentData.patientName}`,
                    price: consultationFee,
                    quantity: 1
                  }],
                  shippingFee: 0,
                  orderData: { type: 'appointment', appointmentData },
                  successUrl: `${window.location.origin}/payment-success?type=appointment`,
                  cancelUrl: `${window.location.origin}/doctor-consultation`
                })
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const session = await response.json();

              if (session.id) {
                // Redirect to real Stripe checkout
                await stripe.redirectToCheckout({ sessionId: session.id });
              } else {
                throw new Error('No session ID received from payment gateway');
              }
            } catch (stripeError) {
              console.error('Stripe payment error:', stripeError);
              console.log('Falling back to mock Stripe checkout...');

              // Fallback to mock Stripe checkout (same as cart)
              try {
                // Create mock Stripe checkout data for appointment
                const checkoutData = {
                  sessionId: 'cs_test_' + Math.random().toString(36).substring(2, 9),
                  items: [{
                    name: `Doctor Consultation - ${appointmentData.patientName}`,
                    price: consultationFee,
                    quantity: 1
                  }],
                  total: consultationFee,
                  shippingFee: 0,
                  type: 'appointment' // Mark this as appointment payment
                };

                // Store checkout data for the mock Stripe page
                localStorage.setItem('stripeCheckoutData', JSON.stringify(checkoutData));

                // Show fallback message
                Swal.fire({
                  title: 'Redirecting to Payment...',
                  text: 'Opening secure payment page...',
                  icon: 'info',
                  timer: 1500,
                  showConfirmButton: false
                });

                // Redirect to mock Stripe checkout page
                setTimeout(() => {
                  window.location.href = '/stripe-checkout';
                }, 1500);

              } catch (fallbackError) {
                console.error('Fallback error:', fallbackError);

                // Clear pending data on error
                localStorage.removeItem('pendingAppointmentData');

                Swal.fire({
                  icon: 'error',
                  title: 'Payment Gateway Error',
                  text: 'Unable to process payment. Please try offline payment or contact support.',
                  timer: 3000,
                  showConfirmButton: false
                });
              }
            }
          }, 1800);
        } catch (paymentError) {
          console.error('Payment setup error:', paymentError);
          Swal.fire({
            icon: 'error',
            title: 'Payment Setup Failed',
            text: 'Unable to setup payment. Please try offline payment or contact support.',
            timer: 3000,
            showConfirmButton: false
          });
        }
      }
    } catch (error) {
      console.error('Appointment booking error:', error.message);
      Swal.fire({
        icon: 'error',
        title: 'Booking Failed',
        text: error.message || 'Failed to book appointment. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doctor-consultation-form-bg">
      <h1>Doctor Consultation Form</h1>
      <form className="doctor-consultation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name: <span style={{color:'red'}}>*</span></label>
          <input type="text" id="patientName" name="patientName" value={form.patientName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address: <span style={{color:'red'}}>*</span></label>
          <input type="email" id="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number: <span style={{color:'red'}}>*</span></label>
          <input type="tel" id="phone" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91-9876543210" />
        </div>
        <div className="form-group">
          <label htmlFor="dob">Date of Birth: <span style={{color:'red'}}>*</span></label>
          <input type="date" id="dob" name="dob" value={form.dob} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender: <span style={{color:'red'}}>*</span></label>
          <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="consultationType">Consultation Type: <span style={{color:'red'}}>*</span></label>
          <select id="consultationType" name="consultationType" value={form.consultationType} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="General Consultation">In‑Person</option>
            <option value="online">Online / Tele‑Consultation</option>
            <option value="Emergency">Emergency</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="preferredDate">Preferred Appointment Date: <span style={{color:'red'}}>*</span></label>
          <input type="date" id="preferredDate" name="preferredDate" value={form.preferredDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="symptoms">Brief Description of Symptoms / Reason for Consultation: <span style={{color:'red'}}>*</span></label>
          <textarea id="symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} required></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="attachReports">Attach Medical Reports (optional):</label>
          <input type="file" id="attachReports" name="attachReports" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Payment Method: <span style={{color:'red'}}>*</span></label>
          <select value={payment} onChange={e => setPayment(e.target.value)} required>
            <option value="" disabled>Select Payment Method</option>
            <option>Offline Payment / CASH</option>
            <option>Online Payment</option>
          </select>
        </div>
        {payment === 'Offline Payment / CASH' ? (
          <button type="submit" disabled={loading}>
            {loading ? 'Booking...' : 'Place Order'}
          </button>
        ) : (
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        )}
      </form>
    </div>
  );
}
