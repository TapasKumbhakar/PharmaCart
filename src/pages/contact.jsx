import React from 'react';
import './contact.css';

export default function Contact() {
  return (
    <div className="contact-container">
      <div className="contact-content">
        <h2>Contact Us</h2>
        <form className="contact-form">
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
          <button type="submit">Send Message</button>
        </form>
        <p className="contact-info">Or email us at <a href="mailto:support@PharmaCart.com">support@PharmaCart.com</a></p>
        <p className='contact-no'>Or call us at <a href="tel:+919876543210">+91 98765 43210</a></p>
      </div>
    </div>
  );
}
