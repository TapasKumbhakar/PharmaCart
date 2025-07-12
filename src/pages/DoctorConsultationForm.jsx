
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { stripePromise } from '../stripe';
import './DoctorConsultationForm.css';

const doctors = [
  { id: 1, name: 'Dr. A. Sharma', specialty: 'Cardiologist' },
  { id: 2, name: 'Dr. B. Gupta', specialty: 'Dermatologist' },
  { id: 3, name: 'Dr. C. Singh', specialty: 'Pediatrician' },
];

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
  const navigate = useNavigate();
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
    // Doctor selection removed, no check needed
    if (!payment) {
      Swal.fire({ icon: 'warning', title: 'Select payment method', text: 'Please select a payment method.', timer: 1800, showConfirmButton: false });
      return;
    }
    if (payment === 'Cash On Delivery') {
      Swal.fire({ title: 'Order Placed!', text: 'Your consultation has been booked successfully.', icon: 'success', timer: 2000, showConfirmButton: false });
      setTimeout(() => navigate('/'), 2000);
    } else if (payment === 'Online Payment') {
      Swal.fire({ title: 'Redirecting to payment gateway...', text: 'Please wait while we process your payment.', icon: 'info', timer: 1800, showConfirmButton: false });
      setTimeout(async () => {
        const stripe = await stripePromise;
        const response = await fetch('http://localhost:4242/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartItems: [{ name: `Doctor Consultation`, price: consultationFee, quantity: 1 }],
            shippingFee: 0
          })
        });
        const session = await response.json();
        if (session.id) {
          await stripe.redirectToCheckout({ sessionId: session.id });
        }
      }, 1800);
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
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="consultationType">Consultation Type: <span style={{color:'red'}}>*</span></label>
          <select id="consultationType" name="consultationType" value={form.consultationType} onChange={handleChange} required>
            <option value="">--Select--</option>
            <option value="inperson">In‑Person</option>
            <option value="online">Online / Tele‑Consultation</option>
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
            <option>Cash On Delivery</option>
            <option>Online Payment</option>
          </select>
        </div>
        {payment === 'Cash On Delivery' ? (
          <button type="submit">Place Order</button>
        ) : (
          <button type="submit">Pay Now</button>
        )}
      </form>
    </div>
  );
}
