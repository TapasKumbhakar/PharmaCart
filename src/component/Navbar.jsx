import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Navbar.css';
import pharmalogo from '../assets/logo/pharmalogo.png';
import cartIcon from '../assets/logo/cart.png'; 

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <img className="navbar-logo" src={pharmalogo} alt="PharmaCart Logo" />
      <div className="navbar-right">
        <ul className="navbar-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <img src={cartIcon} alt="Cart" style={{ width: 24, height: 24, objectFit: 'contain' }}/>
              Cart
            </Link>
          </li>
          <li><Link to="/contact">ContactUs</Link></li>
        </ul>
        <button className="navbar-login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </nav>
  )
}