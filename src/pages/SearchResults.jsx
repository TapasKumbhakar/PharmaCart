import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './SearchResults.css';

export default function SearchResults({ products = [], addToCart }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [similarMedicines, setSimilarMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [searchParams, products]);

  const performSearch = (query) => {
    setLoading(true);
    
    // Find exact match
    const exactMatch = products.find(
      product => product.name.toLowerCase() === query.toLowerCase()
    );

    if (exactMatch) {
      setSearchResult(exactMatch);
      // Find similar medicines (same category or similar name)
      const similar = products.filter(product => 
        product.id !== exactMatch.id && (
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.desc.toLowerCase().includes(query.toLowerCase()) ||
          // Add more similarity logic here
          product.name.toLowerCase().includes('paracetamol') && query.toLowerCase().includes('paracetamol') ||
          product.name.toLowerCase().includes('ibuprofen') && query.toLowerCase().includes('ibuprofen') ||
          product.name.toLowerCase().includes('amoxicillin') && query.toLowerCase().includes('amoxicillin')
        )
      ).slice(0, 4);
      setSimilarMedicines(similar);
    } else {
      setSearchResult('notfound');
      // Find partial matches for suggestions
      const partialMatches = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.desc.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6);
      setSimilarMedicines(partialMatches);
    }
    
    setLoading(false);
  };

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to add items to cart.',
        showConfirmButton: true,
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    addToCart(product);
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      timer: 1500,
      showConfirmButton: false
    });
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: 'warning',
        title: 'Please Login',
        text: 'You need to login to purchase items.',
        showConfirmButton: true,
        confirmButtonText: 'Login',
        showCancelButton: true,
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
      return;
    }

    // Add to cart and navigate to cart
    addToCart(product);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="search-results-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Searching medicines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-header">
        <h1>Search Results</h1>
        <p>Showing results for: <strong>"{searchQuery}"</strong></p>
      </div>

      {searchResult && searchResult !== 'notfound' ? (
        <div className="search-results-content">
          {/* Main Product Result */}
          <div className="main-result-section">
            <h2>Found Medicine</h2>
            <div className="main-product-card">
              <div className="product-image-container">
                <img src={searchResult.img} alt={searchResult.name} className="product-image" />
              </div>
              <div className="product-details">
                <h3 className="product-name">{searchResult.name}</h3>
                <p className="product-description">{searchResult.desc}</p>
                <div className="product-price">{searchResult.price}</div>
                <div className="product-actions">
                  <button 
                    className="btn-add-to-cart"
                    onClick={() => handleAddToCart(searchResult)}
                  >
                    Add to Cart
                  </button>
                  <button 
                    className="btn-buy-now"
                    onClick={() => handleBuyNow(searchResult)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Medicines */}
          {similarMedicines.length > 0 && (
            <div className="similar-medicines-section">
              <h2>Similar Medicines</h2>
              <div className="similar-medicines-grid">
                {similarMedicines.map(medicine => (
                  <div key={medicine.id} className="similar-medicine-card">
                    <img src={medicine.img} alt={medicine.name} className="similar-medicine-image" />
                    <div className="similar-medicine-info">
                      <h4>{medicine.name}</h4>
                      <p>{medicine.desc}</p>
                      <div className="similar-medicine-price">{medicine.price}</div>
                      <div className="similar-medicine-actions">
                        <button 
                          className="btn-add-small"
                          onClick={() => handleAddToCart(medicine)}
                        >
                          Add to Cart
                        </button>
                        <button 
                          className="btn-buy-small"
                          onClick={() => handleBuyNow(medicine)}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="no-results-section">
          <div className="no-results-content">
            <div className="no-results-icon">🔍</div>
            <h2>Medicine Not Available</h2>
            <p>Sorry, we couldn't find "{searchQuery}" in our inventory.</p>
            
            {similarMedicines.length > 0 ? (
              <div className="suggestions-section">
                <h3>You might be interested in these alternatives:</h3>
                <div className="suggestions-grid">
                  {similarMedicines.map(medicine => (
                    <div key={medicine.id} className="suggestion-card">
                      <img src={medicine.img} alt={medicine.name} className="suggestion-image" />
                      <div className="suggestion-info">
                        <h4>{medicine.name}</h4>
                        <p>{medicine.desc}</p>
                        <div className="suggestion-price">{medicine.price}</div>
                        <div className="suggestion-actions">
                          <button 
                            className="btn-add-small"
                            onClick={() => handleAddToCart(medicine)}
                          >
                            Add to Cart
                          </button>
                          <button 
                            className="btn-buy-small"
                            onClick={() => handleBuyNow(medicine)}
                          >
                            Buy Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-alternatives">
                <p>No similar medicines found. Try searching with different keywords.</p>
                <button 
                  className="btn-browse-all"
                  onClick={() => navigate('/Card-Container')}
                >
                  Browse All Medicines
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="back-to-home">
        <button 
          className="btn-back-home"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
