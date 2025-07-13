import React from 'react';
import './Card-Container.css';
import { useNavigate } from 'react-router-dom';
// import paracetamolImg from '../assets/medicines/paracetamol-500-mg-tablet.png';
// import ibuprofenImg from '../assets/medicines/ibuprofen-400mg-tablets-1740783905Ibuprofen-400mg-Tablets.png';
// import amoxicillinImg from '../assets/medicines/amoxicillin.png';
// import cetirizineImg from '../assets/medicines/cetirizine.png';
// import metforminImg from '../assets/medicines/metformin.png';
// import azithromycinImg from '../assets/medicines/azithromycin.png';

const defaultProducts = [
  // {
  //   id: 1,
  //   name: 'Paracetamol',
  //   desc: 'Pain reliever and a fever reducer.',
  //   img: paracetamolImg,
  //   price: 'MRP ₹30'
  // },
  // {
  //   id: 2,
  //   name: 'Ibuprofen',
  //   desc: 'Nonsteroidal anti-inflammatory drug (NSAID).',
  //   img: ibuprofenImg,
  //   price: 'MRP ₹45'
  // },
  // {
  //   id: 3,
  //   name: 'Amoxicillin',
  //   desc: 'Antibiotic used to treat bacterial infections.',
  //   img: amoxicillinImg,
  //   price: 'MRP ₹120'
  // },
  // {
  //   id: 4,
  //   name: 'Cetirizine',
  //   desc: 'Antihistamine used for allergy relief.',
  //   img: cetirizineImg,
  //   price: 'MRP ₹25'
  // },
  // {
  //   id: 5,
  //   name: 'Metformin',
  //   desc: 'Used to treat type 2 diabetes.',
  //   img: metforminImg,
  //   price: 'MRP ₹60'
  // },
  // {
  //   id: 6,
  //   name: 'Azithromycin',
  //   desc: 'Antibiotic for various bacterial infections.',
  //   img: azithromycinImg,
  //   price: 'MRP ₹150'
  // },
];

export default function CardContainer(props) {
  const navigate = useNavigate();
  const products = Array.isArray(props.product) && props.product.length > 0 ? props.product : defaultProducts;

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (props.addToCart) {
      props.addToCart(product);
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (props.addToCart) {
      props.addToCart(product);
    }
    navigate('/cart');
  };

  return (
    <div className="medicine-page-container">
      {/* Enhanced Banner Section */}
      <div className="medicine-banner-section">
        <div className="banner-content">
          <div className="banner-text">
            <h1>Premium Medicines</h1>
            <p>Authentic medicines from trusted brands, delivered safely to your doorstep</p>
            <div className="banner-features">
              <div className="feature-item">
                <span className="feature-icon">🚚</span>
                <span>Fast Delivery</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✅</span>
                <span>Genuine Products</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💊</span>
                <span>Expert Verified</span>
              </div>
            </div>
          </div>
          <div className="banner-decoration">
            <div className="floating-pill pill-1">💊</div>
            <div className="floating-pill pill-2">🏥</div>
            <div className="floating-pill pill-3">⚕️</div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="medicine-content">
        <div className="section-header">
          <h2>Available Medicines</h2>
          <p>Choose from our wide range of quality medicines</p>
        </div>

        <div className="medicine-grid">
          {products.map(product => (
            <div className="medicine-card" key={product.id} onClick={() => navigate(`/id/${product.id}`)}>
              <div className="card-badge">
                <span>Verified</span>
              </div>

              <div className="medicine-image-container">
                <img src={product.img} alt={product.name} className="medicine-image" />
                <div className="image-overlay">
                  <span className="quick-view">Quick View</span>
                </div>
              </div>

              <div className="medicine-info">
                <h3 className="medicine-name">{product.name}</h3>
                <p className="medicine-description">{product.desc}</p>

                <div className="medicine-footer">
                  <div className="price-section">
                    <span className="current-price">{product.price}</span>
                    <span className="original-price">MRP ₹{parseInt(product.price.replace(/[^\d]/g, '')) + 20}</span>
                  </div>

                  <div className="action-buttons">
                    <button
                      className="btn-add-cart"
                      onClick={(e) => handleAddToCart(product, e)}
                      title="Add to Cart"
                    >
                      <span className="btn-icon">🛒</span>
                    </button>
                    <button
                      className="btn-buy-now"
                      onClick={(e) => handleBuyNow(product, e)}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>

                <div className="medicine-meta">
                  <div className="rating">
                    <span className="stars">⭐⭐⭐⭐⭐</span>
                    <span className="rating-text">4.8 (120 reviews)</span>
                  </div>
                  <div className="availability">
                    <span className="stock-indicator"></span>
                    <span>In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">💊</div>
            <h3>No medicines available</h3>
            <p>Please check back later for our medicine catalog</p>
          </div>
        )}
      </div>
    </div>
  );
}
