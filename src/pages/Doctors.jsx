import React from 'react';
import DoctorCard from '../component/Doctor-card';
import '../component/Card-Container.css';

const doctors = [
  {
    id: 1,
    name: 'Dr. Aditi Sharma',
    desc: 'General Physician, 10+ years experience',
    img: 'https://images.unsplash.com/photo-1511174511562-5f97f4f4eab6?auto=format&fit=crop&w=400&q=80',
    fee: '₹400'
  },
  {
    id: 2,
    name: 'Dr. Rahul Mehra',
    desc: 'Cardiologist, 15+ years experience',
    img: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&w=400&q=80',
    fee: '₹700'
  },
  {
    id: 3,
    name: 'Dr. Priya Verma',
    desc: 'Dermatologist, 8+ years experience',
    img: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80',
    fee: '₹500'
  },
  {
    id: 4,
    name: 'Dr. Sameer Khan',
    desc: 'Pediatrician, 12+ years experience',
    img: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
    fee: '₹450'
  },
  {
    id: 5,
    name: 'Dr. Neha Singh',
    desc: 'Gynecologist, 9+ years experience',
    img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    fee: '₹600'
  },
];

export default function Doctors() {
  return (
    <div className="card-container">
      <div className="banner-section" style={{background: 'linear-gradient(90deg, #059669 60%, #34d399 100%)'}}>
        <h1>Doctor Consultation</h1>
        <p>Book an appointment with top doctors online.</p>
      </div>
      {/* <h2>Our Doctors</h2> */}
      <div className="card-list">
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id} {...doctor} />
        ))}
      </div>
    </div>
  );
}
