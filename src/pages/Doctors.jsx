import React from 'react';
import DoctorCard from '../component/Doctor-card';
import './Doctors.css';
import Rahul from '../assets/doctimage/doct1.jpeg';
import Aditi from '../assets/doctimage/doct2.jpeg';
import Priya from '../assets/doctimage/doct3.jpeg';
import Neha from '../assets/doctimage/doct4.jpeg';
import Sameer from '../assets/doctimage/doct5.jpeg';

const doctors = [
  {
    id: 1,
    name: 'Dr. Aditi Sharma',
    specialty: 'General Physician',
    experience: '10+ years',
    desc: 'Specializes in preventive care, diagnosis and treatment of common illnesses',
    img: Aditi,
    fee: '₹400',
    rating: 4.8,
    reviews: 156,
    availability: 'Available Today',
    languages: ['Hindi', 'English'],
    education: 'MBBS, MD - General Medicine',
    nextSlot: '2:30 PM'
  },
  {
    id: 2,
    name: 'Dr. Rahul Mehra',
    specialty: 'Cardiologist',
    experience: '15+ years',
    desc: 'Expert in heart diseases, cardiac surgery and preventive cardiology',
    img: Rahul,
    fee: '₹700',
    rating: 4.9,
    reviews: 203,
    availability: 'Available Today',
    languages: ['Hindi', 'English', 'Punjabi'],
    education: 'MBBS, MD - Cardiology, DM',
    nextSlot: '3:00 PM'
  },
  {
    id: 3,
    name: 'Dr. Priya Verma',
    specialty: 'Dermatologist',
    experience: '8+ years',
    desc: 'Skin care specialist, cosmetic dermatology and hair treatment expert',
    img: Priya,
    fee: '₹500',
    rating: 4.7,
    reviews: 128,
    availability: 'Available Tomorrow',
    languages: ['Hindi', 'English'],
    education: 'MBBS, MD - Dermatology',
    nextSlot: '10:00 AM'
  },
  {
    id: 4,
    name: 'Dr. Sameer Khan',
    specialty: 'Pediatrician',
    experience: '12+ years',
    desc: 'Child health specialist, vaccination and growth development expert',
    img: Sameer,
    fee: '₹450',
    rating: 4.8,
    reviews: 189,
    availability: 'Available Today',
    languages: ['Hindi', 'English', 'Urdu'],
    education: 'MBBS, MD - Pediatrics',
    nextSlot: '4:15 PM'
  },
  {
    id: 5,
    name: 'Dr. Neha Singh',
    specialty: 'Gynecologist',
    experience: '9+ years',
    desc: 'Women\'s health specialist, pregnancy care and reproductive health expert',
    img: Neha,
    fee: '₹600',
    rating: 4.9,
    reviews: 174,
    availability: 'Available Today',
    languages: ['Hindi', 'English'],
    education: 'MBBS, MS - Gynecology',
    nextSlot: '5:00 PM'
  },
];

export default function Doctors() {
  return (
    <div className="doctors-page">
      {/* Enhanced Banner Section */}
      <div className="doctors-banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Expert Doctor Consultation</h1>
            <p>Connect with qualified doctors from the comfort of your home</p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feature-icon">👨‍⚕️</span>
                <span>Verified Doctors</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💬</span>
                <span>Online Consultation</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⏰</span>
                <span>24/7 Available</span>
              </div>
            </div>
          </div>
          {/* <div className="banner-decoration">
            <div className="floating-icon icon-1">🩺</div>
            <div className="floating-icon icon-2">💊</div>
            <div className="floating-icon icon-3">❤️</div>
          </div> */}
        </div>
      </div>

      {/* Doctors Content Section */}
      <div className="doctors-content">
        <div className="section-header">
          <h2>Our Expert Doctors</h2>
          <p>Choose from our panel of experienced and qualified doctors</p>
          <div className="doctors-stats">
            <div className="stat-item">
              <span className="stat-number">{doctors.length}</span>
              <span className="stat-label">Expert Doctors</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Patients</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4.8</span>
              <span className="stat-label">Average Rating</span>
            </div>
          </div>
        </div>

        <div className="doctors-grid">
          {doctors.map(doctor => (
            <DoctorCard key={doctor.id} {...doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}
