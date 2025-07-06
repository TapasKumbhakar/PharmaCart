import React from 'react';
import DoctorCard from '../component/Doctor-card';
import '../component/Card-Container.css';
import Rahul from '../assets/doctimage/doct1.jpeg';
import Aditi from '../assets/doctimage/doct2.jpeg';
import Priya from '../assets/doctimage/doct3.jpeg';
import Neha from '../assets/doctimage/doct4.jpeg';
import Sameer from '../assets/doctimage/doct5.jpeg';

const doctors = [
  {
    id: 1,
    name: 'Dr. Aditi Sharma',
    desc: 'General Physician, 10+ years experience',
    img: Aditi,
    fee: '₹400'
  },
  {
    id: 2,
    name: 'Dr. Rahul Mehra',
    desc: 'Cardiologist, 15+ years experience',
    img: Rahul,
    fee: '₹700'
  },
  {
    id: 3,
    name: 'Dr. Priya Verma',
    desc: 'Dermatologist, 8+ years experience',
    img: Priya,
    fee: '₹500'
  },
  {
    id: 4,
    name: 'Dr. Sameer Khan',
    desc: 'Pediatrician, 12+ years experience',
    img: Sameer,
    fee: '₹450'
  },
  {
    id: 5,
    name: 'Dr. Neha Singh',
    desc: 'Gynecologist, 9+ years experience',
    img: Neha ,
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
