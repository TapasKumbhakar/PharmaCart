import React from 'react';
import './Navbar.css';
import pharmalogo from '../assets/logo/pharmalogo.png';
import { Link, useNavigate } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar(props) {
  const { cartCount = 0 } = props; // get cartCount from props
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      {/* Logo navigates to home */}
      <Link to="/">
        <img
          className="navbar-logo"
          src={pharmalogo}
          alt="PharmaCart Logo"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Attractive Home SVG in black */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#homeGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <defs>
                  <linearGradient id="homeGradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <path d="M4 12L12 5l8 7"/>
                <rect x="6" y="12" width="12" height="8" rx="2" fill="#fff" stroke="url(#homeGradient)"/>
                <path d="M9 16h6" stroke="url(#homeGradient)" strokeWidth="1.5"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Modern About SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#aboutGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="aboutGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>About</span>
            </Link>
          </li>
          <li>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
              {/* Modern Cart SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#cartGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="cartGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
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
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Modern Contact SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#contactGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="contactGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>ContactUs</span>
            </Link>
          </li>
        </ul>

        {/* Right side auth control */}
        <div style={{ marginLeft: '20px' }}>
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <button
              className="navbar-login-btn"
              onClick={() => navigate('/login')}
              style={{
                background: 'linear-gradient(90deg, rgb(99, 102, 241) 60%, rgb(15, 227, 171) 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 24px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(99,102,241,0.09)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
