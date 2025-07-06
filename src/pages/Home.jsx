import React, { useEffect, useState } from "react";
import "../pages/Home.css";
import { useNavigate } from "react-router-dom";
import storeTakeawayImg from "../assets/four card/storetakeway.png";
import doctorImg from "../assets/four card/doctor.png";
import medicineImg from "../assets/four card/medicine.png";
import uploadfileImg from "../assets/four card/upload file.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const homeCards = [
  {
    title: "Medicine",
    desc: "Browse and order medicines online.",
    img: medicineImg,
    route: "/Card-Container",
  },
  {
    title: "Doctor Consultant",
    desc: "Book appointments with top doctors.",
    img: doctorImg,
    route: "/doctors",
  },
  {
    title: "Order with Prescription",
    desc: "Upload your prescription and order easily.",
    img: uploadfileImg,
    route: "/upload", // updated route
  },
  {
    title: "Store Takeaway",
    desc: "Pick up your order from a nearby store.",
    img: storeTakeawayImg,
    route: "/store", // updated route
  },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <div className="banner-section">
        <h1>Welcome to PharmaCart</h1>
        <h3>
          Your trusted online pharmacy for genuine medicines and health
          essentials.
        </h3>
      </div>

      <div style={{ width: "100%" }}>
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Welcome+to+PharmaCart"
              alt="Banner 1"
            />
            <p className="legend">Order Medicines Online</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Consult+Top+Doctors"
              alt="Banner 2"
            />
            <p className="legend">Consult Certified Doctors</p>
          </div>
          <div>
            <img
              src="https://via.placeholder.com/1200x400?text=Get+Your+Health+Back"
              alt="Banner 3"
            />
            <p className="legend">Health Comes First</p>
          </div>
        </Carousel>
      </div>
      <div className="home-container">
        <div className="home-cards-section">
          {homeCards.map((card) => (
            <div
              className="home-card"
              key={card.title}
              onClick={() => card.route && navigate(card.route)}
              style={{ cursor: card.route ? "pointer" : "default" }}
            >
              <img src={card.img} alt={card.title} className="home-card-img" />
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
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
    </>
  );
}
