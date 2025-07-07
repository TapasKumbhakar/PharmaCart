import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './UserDropdown.css';

export default function UserDropdown() {
  const { isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) return null;

  return (
    <div
      className="user-dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="user-icon">👤 User ▾</div>
      {open && (
        <div className="dropdown-menu">
          <a href="/orders">My Orders</a>
          <a href="/saved">Save For Later</a>
          <a href="/medical">Medical Records</a>
          <a href="/profile">My Profile</a>
          <a href="/wallet">Wallet</a>
          <a href="/refer">Refer & Earn</a>
          <a href="/notifications">Notifications</a>
          <button onClick={logout}>Log Out</button>
        </div>
      )}
    </div>
  );
}
