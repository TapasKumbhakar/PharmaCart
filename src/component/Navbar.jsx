import React from 'react'
import './Navbar.css';
import pharmalogo from '../assets/logo/pharmalogo.png';
import cartIcon from '../assets/logo/cart.png'; 

export default function Navbar() {
  return (
    <nav className="navbar">
      <img className="navbar-logo" src={pharmalogo} alt="PharmaCart Logo" />
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <a href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img src={cartIcon} alt="Cart" style={{ width: 24, height: 24, objectFit: 'contain' }}/>
              Cart
            </a>
          </li>
          <li><a href="/contact">ContactUs</a></li>
        </ul>
        <button className="navbar-login-btn" onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </nav>
  )
}
