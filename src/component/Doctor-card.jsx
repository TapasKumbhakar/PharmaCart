import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function DoctorCard({ name, desc, img, fee }) {
  const navigate = useNavigate();
  return (
    <div className="card">
      <div className="img-box">
        <img src={img} alt={name} style={{maxWidth: '100%', maxHeight: '100%', borderRadius: 8}} />
      </div>
      <div className='card-container-content'>
        <h3>{name}</h3>
        <p>{desc}</p>
        <p style={{fontWeight: 600, color: '#059669', margin: '8px 0'}}>Consultation Fee: {fee}</p>
        <button className="BookNow-btn" style={{background: '#059669' , cursor: 'pointer'}} onClick={() => navigate('/doctor-consultation')}>Book Now</button>
      </div>
    </div>
  );
}
