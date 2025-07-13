import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorCard({
  name,
  specialty,
  experience,
  desc,
  img,
  fee,
  rating,
  reviews,
  availability,
  languages,
  education,
  nextSlot
}) {
  const navigate = useNavigate();

  const getAvailabilityColor = (availability) => {
    if (availability === 'Available Today') return '#059669';
    if (availability === 'Available Tomorrow') return '#f59e0b';
    return '#6b7280';
  };

  return (
    <div className="enhanced-doctor-card">
      <div className="doctor-card-header">
        <div className="doctor-image-container">
          <img src={img} alt={name} className="doctor-image" />
          <div className="availability-badge" style={{ backgroundColor: getAvailabilityColor(availability) }}>
            <span className="availability-dot"></span>
            {availability}
          </div>
        </div>

        <div className="doctor-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>⭐</span>
            ))}
          </div>
          <span className="rating-text">{rating} ({reviews} reviews)</span>
        </div>
      </div>

      <div className="doctor-info">
        <h3 className="doctor-name">{name}</h3>
        <div className="doctor-specialty">
          <span className="specialty-icon">🩺</span>
          <span>{specialty}</span>
        </div>
        <div className="doctor-experience">
          <span className="experience-icon">📅</span>
          <span>{experience} experience</span>
        </div>
        <p className="doctor-description">{desc}</p>

        <div className="doctor-details">
          <div className="detail-item">
            <span className="detail-icon">🎓</span>
            <span className="detail-text">{education}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🗣️</span>
            <span className="detail-text">{languages.join(', ')}</span>
          </div>
        </div>
      </div>

      <div className="doctor-footer">
        <div className="consultation-info">
          <div className="fee-section">
            <span className="fee-label">Consultation Fee</span>
            <span className="fee-amount">{fee}</span>
          </div>
          <div className="next-slot">
            <span className="slot-icon">⏰</span>
            <span>Next: {nextSlot}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="view-profile-btn">
            <span className="btn-icon">👤</span>
            View Profile
          </button>
          <button
            className="book-appointment-btn"
            onClick={() => navigate('/doctor-consultation')}
          >
            <span className="btn-icon">📅</span>
            Book Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
