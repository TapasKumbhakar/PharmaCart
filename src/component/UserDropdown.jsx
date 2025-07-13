
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './UserDropdown.css';
export default function UserDropdown() {
  const { isLoggedIn, userType, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      import('sweetalert2').then(Swal => {
        Swal.default.fire({
          icon: 'success',
          title: 'Logged out!',
          text: 'You have been logged out successfully.',
          timer: 1800,
          showConfirmButton: false
        }).then(() => {
          navigate('/');
        });
        setTimeout(() => navigate('/'), 1800);
      });
    }, 100);
  };

  if (!isLoggedIn) return null;

  return (
    <div
      className="user-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="user-icon" style={{display:'flex',alignItems:'center',gap:'6px'}}>
        {/* Modern user SVG in black */}
        <svg width="22" height="22" fill="none" stroke="url(#userGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{verticalAlign:'middle'}}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="60%" stop-color="rgb(99, 102, 241)" />
              <stop offset="100%" stop-color="rgb(15, 227, 171)" />
            </linearGradient>
          </defs>
          <circle cx="12" cy="8" r="4"/>
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4"/>
        </svg>
        <span style={{ color: '#111', fontWeight: 600 }}>{userType ? userType : 'User'} ▾</span>
      </div>
      {open && (
        <div className="dropdown-menu">
          <a href="/orders">My Orders</a>
          <a href="/my-appointments">My Appointment</a>
          <a href="/medical">Medical Records</a>
          {/* <a href="/profile">My Profile</a> */}
          {/* <a href="/wallet">Wallet</a> */}
          {/* <a href="/refer">Refer & Earn</a> */}
          {/* <a href="/notifications">Notifications</a> */}
          <button onClick={logout}>Log Out</button>
        </div>
      )}
    </div>
  );
}
