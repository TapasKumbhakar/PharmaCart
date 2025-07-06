import React, { useEffect, useState } from 'react';
import '../pages/Home.css';
import { useNavigate } from 'react-router-dom';
import storeTakeawayImg from '../assets/four card/storetakeway.png';
import doctorImg from '../assets/four card/doctor.png';
import medicineImg from '../assets/four card/medicine.png';
import uploadfileImg from '../assets/four card/upload file.png'; // Assuming this is the correct path for the upload file image


const homeCards = [
  {
    title: 'Medicine',
    desc: 'Browse and order medicines online.',
    img:  medicineImg,
    route: '/Card-Container',
  },
  {
    title: 'Doctor Consultant',
    desc: 'Book appointments with top doctors.',
    img: doctorImg,
    route: '/doctors',
  },
  {
    title: 'Order with Prescription',
    desc: 'Upload your prescription and order easily.',
    img: uploadfileImg,
    route: '/upload', // updated route
  },
  {
    title: 'Store Takeaway',
    desc: 'Pick up your order from a nearby store.',
    img: storeTakeawayImg,
    route: '/store', // updated route
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="banner-section">
        <h1>Welcome to PharmaCart</h1>
        <h3>Your trusted online pharmacy for genuine medicines and health essentials.</h3>
      </div>
      <div className="home-container">
        <div className="home-cards-section">
          {homeCards.map(card => (
            <div
              className="home-card"
              key={card.title}
              onClick={() => card.route && navigate(card.route)}
              style={{cursor: card.route ? 'pointer' : 'default'}}
            >
              <img src={card.img} alt={card.title} className="home-card-img" />
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
          
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
