import React from 'react';
import './signup.css';

export default function Signup() {
  return (
    <div className="signup-box">
      <h2>Sign Up for PharmaCart</h2>
      <form method="POST">
        <input type="text" name="username" placeholder="Username" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" required />
        <input type="submit" value="Sign Up" />
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
    </div>
  );
}
