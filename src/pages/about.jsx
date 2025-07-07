import React from 'react';
import './about.css';

export default function About() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h1>About PharmaCart</h1>
        <p>
          PharmaCart is your trusted online pharmacy platform, dedicated to making healthcare accessible and convenient for everyone. We offer a wide range of medicines, health products, and doctor consultations, all from the comfort of your home.
        </p>
        <h2>Our Mission</h2>
        <p>
          To provide safe, affordable, and timely healthcare solutions, ensuring that quality medicines and expert advice are just a click away.
        </p>
        <h2>Why Choose PharmaCart?</h2>
        <ul style={{textAlign: 'left', margin: '0 auto', maxWidth: 400}}>
          <li>Wide selection of genuine medicines</li>
          <li>Easy and secure ordering process</li>
          <li>Expert doctor consultations</li>
          <li>Fast and reliable delivery</li>
          <li>Dedicated customer support</li>
        </ul>
        <p>
          Thank you for choosing PharmaCart as your healthcare partner!
        </p>
      </div>
    </div>
  );
}
