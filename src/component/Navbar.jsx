import React from 'react';
import './Navbar.css';
import pharmalogo from '../assets/logo/pharmalogo.png';
import cartIcon from '../assets/logo/cart.png';

export default function Navbar({ cartCount = 0, ...props }) {
  return (
    <nav className="navbar">
      <a href="/">
        <img className="navbar-logo" src={pharmalogo} alt="PharmaCart Logo" style={{ cursor: 'pointer' }} />
      </a>
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <a href="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}>
              <img src={cartIcon} alt="Cart" style={{ width: 24, height: 24, objectFit: 'contain' }}/>
              Cart
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -16,
                  background: '#059669',
                  color: '#fff',
                  borderRadius: '50%',
                  fontSize: 12,
                  minWidth: 18,
                  height: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 5px',
                  fontWeight: 700,
                  zIndex: 2
                }}>{cartCount}</span>
              )}
            </a>
          </li>
          <li><a href="/contact">ContactUs</a></li>
        </ul>
        <button className="navbar-login-btn" onClick={() => window.location.href = '/login'}>Login</button>
      </div>
    </nav>
  );
}
