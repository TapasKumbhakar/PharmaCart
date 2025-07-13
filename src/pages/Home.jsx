import React from "react";
import "../pages/Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import storeTakeawayImg from "../assets/four card/storetakeway.png";
import doctorImg from "../assets/four card/doctor.png";
import medicineImg from "../assets/four card/medicine.png";
import uploadfileImg from "../assets/four card/upload file.png";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import banner from "../assets/banner/Banner.jpg";

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
  const { userType, isLoggedIn } = useAuth();

  // If admin is logged in, redirect to admin panel
  React.useEffect(() => {
    if (isLoggedIn && userType === 'Admin') {
      navigate('/admin-panel');
    }
  }, [isLoggedIn, userType, navigate]);

  // Don't show customer features to admin
  if (isLoggedIn && userType === 'Admin') {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Redirecting to Admin Dashboard...</h2>
      </div>
    );
  }

  return (
    <>
      <div className="banner-section">
        <img src={banner} alt="Banner" className="banner-img" />
        {/* <h1 className="banner-title">Welcome to PharmaCart</h1>
        <p className="banner-subtitle">Your one-stop solution for health needs</p> */}

        <div className="home-container">
          <div className="home-cards-section">
            {homeCards.map((card) => (
              <div
                className="home-card"
                key={card.title}
                onClick={() => card.route && navigate(card.route)}
                style={{ cursor: card.route ? "pointer" : "default" }}
              >
                <img
                  src={card.img}
                  alt={card.title}
                  className="home-card-img"
                />
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Promotional Carousel Section - Right after four cards */}
      <div className="promotional-carousel-section">
        <div className="promotional-carousel-container">
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={5000}
            transitionTime={800}
            showIndicators={true}
            swipeable={true}
            emulateTouch={true}
            className="promotional-carousel"
          >
            {/* Welcome Extra Savings Slide */}
            <div className="promo-slide promo-slide-1">
              <div className="promo-content">
                <div className="promo-text">
                  <h2>Welcome Extra Savings!</h2>
                  <div className="savings-badges">
                    <div className="savings-badge primary">
                      <span className="percentage">Save 24%</span>
                      <span className="description">on medicines & healthcare products</span>
                    </div>
                    <div className="savings-badge secondary">
                      <span className="percentage">Extra 5%</span>
                      <span className="description">PharmEasy Credits</span>
                    </div>
                  </div>
                  <div className="promo-code">
                    <span className="code-label">24PYFIT</span>
                    <button className="order-now-btn">Order Now</button>
                  </div>
                </div>
                <div className="promo-image">
                  <div className="person-placeholder">
                    <div className="person-avatar"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Plus Member Slide */}
            <div className="promo-slide promo-slide-2">
              <div className="promo-content">
                <div className="promo-text">
                  <h2>Become a Plus Member</h2>
                  <div className="plus-offer">
                    <span className="at-symbol">@</span>
                    <span className="price">Just ₹99</span>
                    <span className="duration">for 3 Months!</span>
                  </div>
                  <div className="plus-benefits">
                    <div className="benefit-badge">
                      <span className="benefit-icon">⚡</span>
                      <span>Power Plus</span>
                    </div>
                    <div className="benefit-badge">
                      <span className="benefit-icon">💰</span>
                      <span>SAVINGS</span>
                    </div>
                    <div className="benefit-badge sale">
                      <span>SALE</span>
                    </div>
                  </div>
                  <button className="enroll-btn">ENROLL NOW</button>
                </div>
                <div className="promo-image">
                  <div className="plus-icon">+</div>
                </div>
              </div>
            </div>

            {/* Dermatologist Recommended Slide */}
            <div className="promo-slide promo-slide-3">
              <div className="promo-content">
                <div className="promo-text">
                  <div className="recommendation-badge">
                    <span className="number">#1</span>
                    <span className="text">DERMATOLOGIST RECOMMENDED</span>
                    <span className="country">BRAND IN INDIA</span>
                  </div>
                  <div className="extra-credits">
                    <span className="credits-text">Get Extra 5% Plus PharmEasy Credits</span>
                  </div>
                </div>
                <div className="promo-image">
                  <div className="brand-placeholder">
                    <div className="brand-logo"></div>
                  </div>
                </div>
              </div>
            </div>
          </Carousel>
        </div>
      </div>

      {/* Carousel Section - Just above footer */}
      <div className="home-carousel-section">
        <h2 className="carousel-title">Trusted Healthcare Solutions</h2>
        <div className="carousel-container">
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={4000}
            transitionTime={600}
            showIndicators={true}
            swipeable={true}
            emulateTouch={true}
            className="main-carousel"
          >
            {/* <div className="carousel-slide">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?auto=format&fit=crop&w=1200&q=80"
                alt="Modern Pharmacy Interior"
              />
              <div className="carousel-caption">
                <h3>Modern Pharmacy Experience</h3>
                <p>State-of-the-art facilities ensuring quality and safety</p>
              </div>
            </div> */}

            <div className="carousel-slide">
              <img
                src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80"
                alt="Doctor Consultation"
              />
              <div className="carousel-caption">
                <h3>Expert Medical Consultation</h3>
                <p>Connect with qualified doctors from the comfort of your home</p>
              </div>
            </div>

            <div className="carousel-slide">
              <img
                src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80"
                alt="Medicine Delivery"
              />
              <div className="carousel-caption">
                <h3>Fast & Secure Delivery</h3>
                <p>Your medicines delivered safely to your doorstep</p>
              </div>
            </div>

            <div className="carousel-slide">
              <img
                src="https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1200&q=80"
                alt="Online Prescription"
              />
              <div className="carousel-caption">
                <h3>Digital Prescription Management</h3>
                <p>Upload and manage your prescriptions digitally with ease</p>
              </div>
            </div>
          </Carousel>
        </div>
      </div>


    </>
  );
}
