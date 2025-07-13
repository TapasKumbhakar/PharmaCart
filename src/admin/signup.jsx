import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './signup.css';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export default function Signup() {
  const [userType, setUserType] = useState('Customer'); // Customer selected by default
  const [form, setForm] = useState({
    fullname: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validate form
    if (form.password !== form.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Passwords do not match. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    if (form.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        fullname: form.fullname,
        mobile: form.mobile,
        email: form.email,
        password: form.password,
        type: userType
      });

      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: `${userType} signup successful!`,
          text: 'Please log in with your credentials.',
          timer: 2000,
          showConfirmButton: false
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error('Signup error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Signup Failed',
        text: error.message || 'Registration failed. Please try again.',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-box" style={{ minWidth: 340, maxWidth: 400, margin: '40px auto' }}>
      <h2>Sign Up for PharmaCart</h2>
      {/* User type toggle buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '16px' }}>
        <button
          type="button"
          style={{
            background: userType === 'Customer' ? '#3f51b5' : '#f0f0f0',
            color: userType === 'Customer' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: userType === 'Customer' ? '0 2px 8px rgba(63,81,181,0.12)' : 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => handleUserTypeChange('Customer')}
        >
          Customer
        </button>
        <button
          type="button"
          style={{
            background: userType === 'Admin' ? '#3f51b5' : '#f0f0f0',
            color: userType === 'Admin' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: userType === 'Admin' ? '0 2px 8px rgba(63,81,181,0.12)' : 'none',
            transition: 'background 0.2s',
          }}
          onClick={() => handleUserTypeChange('Admin')}
        >
          Admin
        </button>
      </div>
      <form onSubmit={handleSignup} className="signup-form">
        <div className="input-icon-group">
          <span className="input-icon">
            {/* User SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
          </span>
          <input
            type="text"
            name="fullname"
            placeholder="Enter your full name"
            required
            value={form.fullname}
            onChange={handleChange}
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon">
            {/* Mobile SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="17" r="1"/></svg>
          </span>
          <input
            type="tel"
            name="mobile"
            placeholder="Enter your mobile number"
            pattern="[0-9]{10}"
            required
            value={form.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon">
            {/* Email SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
          </span>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon">
            {/* Password SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 16v-4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
          </span>
          <input
            type="password"
            name="password"
            placeholder="Create a password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon">
            {/* Confirm Password SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 16v-4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
          </span>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            required
            value={form.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={!userType}>Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
