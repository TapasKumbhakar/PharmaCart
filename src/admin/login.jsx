import React, { useState } from 'react';
import Swal from 'sweetalert2';
import './login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [userType, setUserType] = useState(''); // none selected by default
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ type: userType, identifier, password });
    Swal.fire({
      icon: 'success',
      title: `${userType} login successful!`,
      text: 'Welcome to PharmaCart.',
      timer: 1800,
      showConfirmButton: false
    });
    setTimeout(() => {
      if (userType === 'Admin') {
        navigate('/admin-panel');
      } else {
        navigate('/');
      }
    }, 1800);
  };

  return (
    <div className="login-box" style={{ minWidth: 340, maxWidth: 400, margin: '40px auto' }}>
      <div className="login-header">
        <h2>Login to PharmaCart</h2>
      </div>
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
      <form onSubmit={handleSubmit} className="login-form">
        <div className="input-icon-group">
          <span className="input-icon">
            {/* User/Email/Phone SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
          </span>
          <input
            type="text"
            name="identifier"
            placeholder="Username / Email / Mobile Number"
            pattern="(^[0-9]{10}$)|(^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$)"
            required
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
          />
        </div>
        <div className="input-icon-group">
          <span className="input-icon">
            {/* Password SVG */}
            <svg width="20" height="20" fill="none" stroke="#000" strokeWidth="1.7" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="8" rx="2"/><path d="M12 16v-4"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/></svg>
          </span>
          <input type="password" name="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="login-btn" disabled={!userType}>Login</button>
      </form>
      <p className="login-signup-text">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}
