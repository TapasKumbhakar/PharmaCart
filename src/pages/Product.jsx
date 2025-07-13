import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Product.css';

export default function Product(props) {
  const { id } = useParams();
  const p = props.product;
  const [added, setAdded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('description');
  const navigate = useNavigate();
  const get = p.find((p) => p.id === parseInt(id, 10));
  const cartItem = Array.isArray(props.cartItems) ? props.cartItems.find((item) => item.id === get?.id) : null;

  const handleBuyNow = () => {
    if (props.addToCart && (!cartItem || cartItem.quantity === 0)) {
      props.addToCart(get);
    }
    navigate('/cart');
  };

  if (!get) {
    return (
      <div className="product-not-found">
        <div className="not-found-content">
          <div className="not-found-icon">💊</div>
          <h2>Medicine Not Found</h2>
          <p>The medicine you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => navigate('/Card-Container')} className="back-to-medicines-btn">
            Browse Medicines
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (props.addToCart) {
      props.addToCart(get);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  // Mock additional product data for enhanced display
  const productDetails = {
    manufacturer: "PharmaCorp Ltd.",
    composition: "Active ingredients and composition details",
    dosage: "As directed by physician",
    sideEffects: "Consult your doctor for potential side effects",
    storage: "Store in a cool, dry place away from direct sunlight",
    expiry: "24 months from manufacturing date",
    rating: 4.8,
    reviews: 127,
    inStock: true,
    fastDelivery: true,
    prescription: false
  };

  return (
    <div className="product-detail-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span onClick={() => navigate('/Card-Container')} className="breadcrumb-link">Medicines</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-current">{get.name}</span>
      </div>

      <div className="product-detail-container">
        {/* Left Section - Product Image */}
        <div className="product-image-section">
          <div className="product-image-container">
            <div className="product-badges">
              {productDetails.prescription && <span className="badge prescription">Prescription Required</span>}
              {productDetails.fastDelivery && <span className="badge fast-delivery">Fast Delivery</span>}
              <span className="badge verified">Verified</span>
            </div>
            <img className="product-main-image" src={get.img} alt={get.name} />
          </div>

          {/* Trust Indicators */}
          <div className="trust-indicators">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <span>100% Authentic</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🚚</span>
              <span>Fast Delivery</span>
            </div>
            <div className="trust-item">
              <span className="trust-icon">💰</span>
              <span>Best Price</span>
            </div>
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-name">{get.name}</h1>
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(productDetails.rating) ? 'star filled' : 'star'}>⭐</span>
                ))}
              </div>
              <span className="rating-text">{productDetails.rating} ({productDetails.reviews} reviews)</span>
            </div>
            <p className="manufacturer">by {productDetails.manufacturer}</p>
          </div>

          {/* Price Section */}
          <div className="price-section">
            <div className="current-price">{get.price}</div>
            <div className="original-price">MRP ₹{parseInt(get.price.replace(/[^\d]/g, '')) + 25}</div>
            <div className="discount-badge">
              {Math.round((25 / (parseInt(get.price.replace(/[^\d]/g, '')) + 25)) * 100)}% OFF
            </div>
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            <span className={`stock-indicator ${productDetails.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {productDetails.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </span>
            <span className="delivery-info">🚚 Delivery in 2-3 days</span>
          </div>

          {/* Quantity and Actions */}
          <div className="product-actions">
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                {(!cartItem || cartItem.quantity === 0) ? (
                  <span className="quantity-display">1</span>
                ) : (
                  <>
                    <button className="qty-btn minus" onClick={() => props.decreaseQuantity && props.decreaseQuantity(get.id)}>-</button>
                    <span className="quantity-display">{cartItem.quantity}</span>
                    <button
                      className={`qty-btn plus ${cartItem.quantity >= 50 ? 'disabled' : ''}`}
                      onClick={() => cartItem.quantity < 50 && props.increaseQuantity && props.increaseQuantity(get.id)}
                      disabled={cartItem.quantity >= 50}
                      title={cartItem.quantity >= 50 ? 'Maximum quantity reached (50)' : 'Increase quantity'}
                    >
                      +
                    </button>
                  </>
                )}
              </div>
              {cartItem && cartItem.quantity >= 50 && (
                <div className="quantity-limit-message">
                  <span style={{ color: '#f59e0b', fontSize: '0.9rem', fontWeight: '500' }}>
                    ⚠️ Maximum quantity limit reached (50 items)
                  </span>
                </div>
              )}
              {cartItem && cartItem.quantity >= 40 && cartItem.quantity < 50 && (
                <div className="quantity-warning-message">
                  <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                    📦 {50 - cartItem.quantity} items remaining
                  </span>
                </div>
              )}
            </div>

            <div className="action-buttons">
              {(!cartItem || cartItem.quantity === 0) ? (
                <button className="btn-add-to-cart" onClick={handleAddToCart}>
                  <span className="btn-icon">🛒</span>
                  Add to Cart
                </button>
              ) : (
                <button className="btn-added-to-cart" disabled>
                  <span className="btn-icon">✅</span>
                  Added to Cart
                </button>
              )}
              <button className="btn-buy-now" onClick={handleBuyNow}>
                <span className="btn-icon">⚡</span>
                Buy Now
              </button>
            </div>
          </div>

          {/* Success Message */}
          {added && (
            <div className="success-message">
              <span className="success-icon">✅</span>
              <span>Medicine added to cart successfully!</span>
            </div>
          )}
        </div>
      </div>

      {/* Product Information Tabs */}
      <div className="product-tabs-section">
        <div className="tabs-header">
          <button
            className={`tab-btn ${selectedTab === 'description' ? 'active' : ''}`}
            onClick={() => setSelectedTab('description')}
          >
            Description
          </button>
          <button
            className={`tab-btn ${selectedTab === 'details' ? 'active' : ''}`}
            onClick={() => setSelectedTab('details')}
          >
            Details
          </button>
          <button
            className={`tab-btn ${selectedTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setSelectedTab('reviews')}
          >
            Reviews
          </button>
        </div>

        <div className="tab-content">
          {selectedTab === 'description' && (
            <div className="tab-panel">
              <h3>Product Description</h3>
              <p>{get.desc}</p>
              <div className="key-benefits">
                <h4>Key Benefits:</h4>
                <ul>
                  <li>Effective and fast-acting formula</li>
                  <li>Clinically tested and approved</li>
                  <li>Safe for regular use as directed</li>
                  <li>Quality assured by certified manufacturers</li>
                </ul>
              </div>
            </div>
          )}

          {selectedTab === 'details' && (
            <div className="tab-panel">
              <h3>Product Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <strong>Composition:</strong>
                  <span>{productDetails.composition}</span>
                </div>
                <div className="detail-item">
                  <strong>Dosage:</strong>
                  <span>{productDetails.dosage}</span>
                </div>
                <div className="detail-item">
                  <strong>Storage:</strong>
                  <span>{productDetails.storage}</span>
                </div>
                <div className="detail-item">
                  <strong>Expiry:</strong>
                  <span>{productDetails.expiry}</span>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'reviews' && (
            <div className="tab-panel">
              <h3>Customer Reviews</h3>
              <div className="reviews-summary">
                <div className="rating-overview">
                  <span className="big-rating">{productDetails.rating}</span>
                  <div className="rating-details">
                    <div className="stars-large">⭐⭐⭐⭐⭐</div>
                    <span>{productDetails.reviews} reviews</span>
                  </div>
                </div>
              </div>
              <div className="sample-reviews">
                <div className="review-item">
                  <div className="reviewer">⭐⭐⭐⭐⭐ <strong>John D.</strong></div>
                  <p>"Excellent quality medicine. Fast delivery and genuine product."</p>
                </div>
                <div className="review-item">
                  <div className="reviewer">⭐⭐⭐⭐⭐ <strong>Sarah M.</strong></div>
                  <p>"Very effective and reasonably priced. Highly recommended!"</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
