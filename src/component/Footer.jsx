import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© {new Date().getFullYear()} PoetryHub. All rights reserved.</span>
        <span className="footer-links">
          <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/privacy">Privacy Policy</a>
        </span>
      </div>
    </footer>
  );
}
