import React from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add authentication logic if needed
    navigate('/'); // Redirect to home page after login
  };

  return (
    <div className="login-box">
      <h2>Login to PharmaCart</h2>
      <form method="POST" onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password"  required  />
        <input type="submit" value="Login" />
      </form>
      <p>Don't have an account? <a href="/register">Sign Up</a></p>
    </div>
  )
}
