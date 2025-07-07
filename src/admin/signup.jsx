import React from 'react';
import './signup.css';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault(); 
    alert('Signup successful! Please log in.');
    navigate('/login');
  };

  return (
    <div className="signup-box">
      <h2>Sign Up for PharmaCart</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create a password"
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          required
        />
        
        <button type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}
