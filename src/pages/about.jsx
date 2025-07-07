import React from 'react';
import './about.css';

export default function About() {
  return (
    <div>
        <h2 className="home-section-title">Why Choose Us?</h2>
        <div className="home-features">
          <div className="home-feature">
            <h3>Genuine Products</h3>
            <p>
              We ensure all medicines are sourced from trusted manufacturers.
            </p>
          </div>
          <div className="home-feature">
            <h3>Convenient Delivery</h3>
            <p>
              Get your orders delivered to your doorstep quickly and safely.
            </p>
          </div>
          <div className="home-feature">
            <h3>Expert Consultation</h3>
            <p>Book appointments with top doctors for online consultations.</p>
          </div>
        </div>
      </div>
  );
}
