import React from 'react';
import './about.css';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About PharmaCart</h1>
          <p>Your trusted partner in healthcare, delivering quality medicines and expert consultation right to your doorstep.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="about-container">
        <div className="about-content">
          <h2>Who We Are</h2>
          <p>
            PharmaCart is a leading online pharmacy platform dedicated to making healthcare accessible,
            affordable, and convenient for everyone. Founded with the mission to bridge the gap between
            patients and quality healthcare, we provide a comprehensive range of medicines, health products,
            and professional medical consultations.
          </p>

          <h2>Our Mission</h2>
          <p>
            To revolutionize healthcare delivery by providing easy access to genuine medicines,
            expert medical consultations, and reliable health services through our digital platform.
            We strive to make healthcare more accessible and affordable for communities everywhere.
          </p>

          <h2>Our Vision</h2>
          <p>
            To become the most trusted and preferred healthcare platform, where every individual
            can access quality healthcare services with confidence and convenience.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="about-features-section">
        <h2 className="home-section-title">Why Choose PharmaCart?</h2>
        <div className="home-features">
          <div className="home-feature">
            <div className="feature-icon">🏥</div>
            <h3>Genuine Products</h3>
            <p>
              We ensure all medicines are sourced from trusted manufacturers and licensed distributors.
              Every product is verified for authenticity and quality.
            </p>
          </div>
          <div className="home-feature">
            <div className="feature-icon">🚚</div>
            <h3>Fast & Safe Delivery</h3>
            <p>
              Get your orders delivered to your doorstep quickly and safely. We offer same-day delivery
              in select cities and secure packaging for all orders.
            </p>
          </div>
          <div className="home-feature">
            <div className="feature-icon">👨‍⚕️</div>
            <h3>Expert Consultation</h3>
            <p>
              Book appointments with qualified doctors for online consultations. Get professional
              medical advice from the comfort of your home.
            </p>
          </div>
          <div className="home-feature">
            <div className="feature-icon">📱</div>
            <h3>Easy Prescription Upload</h3>
            <p>
              Simply upload your prescription and we'll prepare your order. Our pharmacists verify
              every prescription to ensure accuracy and safety.
            </p>
          </div>
          <div className="home-feature">
            <div className="feature-icon">🏪</div>
            <h3>Store Pickup Available</h3>
            <p>
              Prefer to collect your order? Choose from our network of partner stores for convenient
              pickup at your preferred location and time.
            </p>
          </div>
          <div className="home-feature">
            <div className="feature-icon">💰</div>
            <h3>Affordable Prices</h3>
            <p>
              We offer competitive prices on all medicines and health products. Regular discounts
              and offers make healthcare more affordable for everyone.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="about-stats">
        <div className="stats-container">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>Medicines Available</p>
          </div>
          <div className="stat-item">
            <h3>50+</h3>
            <p>Expert Doctors</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Customer Support</p>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="customer-reviews-section">
        <div className="reviews-container">
          <h2 className="reviews-title">What Our Customers Say</h2>
          <p className="reviews-subtitle">Real experiences from real customers who trust PharmaCart</p>

          <div className="reviews-grid">
            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face" alt="Priya Sharma" />
                  </div>
                  <div className="customer-details">
                    <h4>Priya Sharma</h4>
                    <p>Mumbai, Maharashtra</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"Excellent service! I've been ordering medicines from PharmaCart for over a year now. The delivery is always on time, and the medicines are genuine. The online consultation feature is a game-changer!"</p>
              </div>
              <div className="review-footer">
                <span className="review-date">2 weeks ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Rajesh Kumar" />
                  </div>
                  <div className="customer-details">
                    <h4>Rajesh Kumar</h4>
                    <p>Delhi, India</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"Amazing experience! The prescription upload feature is so convenient. I just upload my prescription and get my medicines delivered the same day. Highly recommended for busy professionals."</p>
              </div>
              <div className="review-footer">
                <span className="review-date">1 month ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" alt="Anita Patel" />
                  </div>
                  <div className="customer-details">
                    <h4>Anita Patel</h4>
                    <p>Ahmedabad, Gujarat</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"Great prices and authentic medicines! I compared prices with local pharmacies and PharmaCart offers the best deals. The customer support is also very helpful and responsive."</p>
              </div>
              <div className="review-footer">
                <span className="review-date">3 weeks ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Vikram Singh" />
                  </div>
                  <div className="customer-details">
                    <h4>Vikram Singh</h4>
                    <p>Bangalore, Karnataka</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"The doctor consultation feature is fantastic! I was able to consult with a specialist from home during the pandemic. The doctor was very professional and the prescription was delivered quickly."</p>
              </div>
              <div className="review-footer">
                <span className="review-date">1 week ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" alt="Meera Reddy" />
                  </div>
                  <div className="customer-details">
                    <h4>Meera Reddy</h4>
                    <p>Hyderabad, Telangana</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"Reliable and trustworthy service! I order medicines for my elderly parents and the delivery is always careful and on time. The packaging is excellent and medicines are always fresh."</p>
              </div>
              <div className="review-footer">
                <span className="review-date">2 months ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>

            <div className="review-card">
              <div className="review-header">
                <div className="customer-info">
                  <div className="customer-avatar">
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" alt="Arjun Gupta" />
                  </div>
                  <div className="customer-details">
                    <h4>Arjun Gupta</h4>
                    <p>Pune, Maharashtra</p>
                  </div>
                </div>
                <div className="rating">
                  <span className="stars">⭐⭐⭐⭐⭐</span>
                  <span className="rating-text">5.0</span>
                </div>
              </div>
              <div className="review-content">
                <p>"Outstanding service! The website is easy to use, payment is secure, and delivery is super fast. I've recommended PharmaCart to all my friends and family. Keep up the great work!"</p>
              </div>
              <div className="review-footer">
                <span className="review-date">5 days ago</span>
                <span className="verified-badge">✓ Verified Purchase</span>
              </div>
            </div>
          </div>

          <div className="reviews-summary">
            <div className="summary-stats">
              <div className="overall-rating">
                <h3>4.9</h3>
                <div className="stars-large">⭐⭐⭐⭐⭐</div>
                <p>Based on 2,847 reviews</p>
              </div>
              <div className="rating-breakdown">
                <div className="rating-row">
                  <span>5 stars</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: '92%'}}></div>
                  </div>
                  <span>92%</span>
                </div>
                <div className="rating-row">
                  <span>4 stars</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: '6%'}}></div>
                  </div>
                  <span>6%</span>
                </div>
                <div className="rating-row">
                  <span>3 stars</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: '1%'}}></div>
                  </div>
                  <span>1%</span>
                </div>
                <div className="rating-row">
                  <span>2 stars</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: '0.5%'}}></div>
                  </div>
                  <span>0.5%</span>
                </div>
                <div className="rating-row">
                  <span>1 star</span>
                  <div className="rating-bar">
                    <div className="rating-fill" style={{width: '0.5%'}}></div>
                  </div>
                  <span>0.5%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="about-cta">
        <div className="cta-content">
          <h2>Ready to Experience Better Healthcare?</h2>
          <p>Join thousands of satisfied customers who trust PharmaCart for their healthcare needs.</p>
          <div className="cta-buttons">
            <button className="cta-btn primary" onClick={() => window.location.href = '/Card-Container'}>
              Shop Medicines
            </button>
            <button className="cta-btn secondary" onClick={() => window.location.href = '/doctors'}>
              Book Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
