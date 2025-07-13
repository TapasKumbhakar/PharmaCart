import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import pharmalogo from '../assets/logo/pharmalogo.png';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import UserDropdown from './UserDropdown';
import { useAuth } from '../context/AuthContext';

export default function Navbar(props) {
  const {
    cartCount = 0,
    search = '',
    setSearch = () => {},
    searchResult = null,
    setSearchResult = () => {},
    handleSearch = () => {},
    products = []
  } = props;

  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, userType } = useAuth();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const searchRef = useRef(null);

  // Clear search when navigating to different pages (except search results)
  useEffect(() => {
    if (!location.pathname.includes('/search-results') && setSearch) {
      setSearch('');
      setShowSearchResults(false);
      setSearchSuggestions([]);
    }
  }, [location.pathname, setSearch]);

  // Hide search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate search suggestions
  const generateSuggestions = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchSuggestions([]);
      return;
    }

    const suggestions = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions

    setSearchSuggestions(suggestions);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    if (setSearch) setSearch(value);
    generateSuggestions(value);
    setShowSearchResults(true);

    if (!value.trim()) {
      if (setSearchResult) setSearchResult(null);
      setShowSearchResults(false);
      setSearchSuggestions([]);
    }
  };

  // Clear search function
  const clearSearch = () => {
    if (setSearch) setSearch('');
    if (setSearchResult) setSearchResult(null);
    setShowSearchResults(false);
    setSearchSuggestions([]);
  };

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const searchTerm = search.trim();
    const found = products.find(
      (item) => item.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (found) {
      if (setSearchResult) setSearchResult(found);
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    } else {
      if (setSearchResult) setSearchResult('notfound');
      navigate(`/search-results?q=${encodeURIComponent(searchTerm)}`);
    }

    // Clear search input and hide results
    if (setSearch) setSearch('');
    setShowSearchResults(false);
    setSearchSuggestions([]);
  };

  // Handle suggestion click
  const handleSuggestionClick = (product) => {
    if (setSearchResult) setSearchResult(product);
    setShowSearchResults(false);
    setSearchSuggestions([]);
    navigate(`/search-results?q=${encodeURIComponent(product.name)}`);

    // Clear search input after navigation
    setTimeout(() => {
      if (setSearch) setSearch('');
    }, 100);
  };

  // Don't show search for admin users
  if (userType === 'Admin') {
    return (
      <nav className="navbar">
        <Link to="/">
          <img
            className="navbar-logo"
            src={pharmalogo}
            alt="PharmaCart Logo"
            style={{ cursor: 'pointer' }}
          />
        </Link>

        <div className="navbar-center">
          <div className="admin-nav-links">
            <Link to="/admin-panel" className="admin-nav-link">
              <span className="nav-icon">📊</span>
              Dashboard
            </Link>
            <Link to="/admin-messages" className="admin-nav-link">
              <span className="nav-icon">💬</span>
              Messages
            </Link>
          </div>
        </div>

        <div className="navbar-right">
          <div style={{ marginLeft: '20px' }}>
            {isLoggedIn ? (
              <UserDropdown />
            ) : (
              <button
                className="navbar-login-btn"
                onClick={() => navigate('/login')}
                style={{
                  background: 'rgb(99, 102, 241)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 24px',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 2px 8px rgba(99,102,241,0.09)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      {/* Logo navigates to home */}
      <Link to="/">
        <img
          className="navbar-logo"
          src={pharmalogo}
          alt="PharmaCart Logo"
          style={{ cursor: 'pointer' }}
        />
      </Link>

      {/* Search Bar - Only for customers */}
      <div className="navbar-search" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
              onFocus={() => setShowSearchResults(true)}
            />
            {search && (
              <button
                type="button"
                className="clear-search-button"
                onClick={clearSearch}
                title="Clear search"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
            <button type="submit" className="search-button">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (searchSuggestions.length > 0 || search.trim()) && (
            <div className="search-results-dropdown">
              {searchSuggestions.length > 0 ? (
                <>
                  <div className="search-results-header">
                    <span>Suggestions</span>
                  </div>
                  {searchSuggestions.map((product) => (
                    <div
                      key={product.id}
                      className="search-result-item"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <img src={product.img} alt={product.name} className="search-result-image" />
                      <div className="search-result-info">
                        <span className="search-result-name">{product.name}</span>
                        <span className="search-result-price">{product.price}</span>
                      </div>
                    </div>
                  ))}
                  {search.trim() && !searchSuggestions.some(p => p.name.toLowerCase() === search.toLowerCase()) && (
                    <div className="search-no-exact-match">
                      <span>Press Enter to search for "{search}"</span>
                    </div>
                  )}
                </>
              ) : search.trim() ? (
                <div className="search-no-results">
                  <span>No medicines found for "{search}"</span>
                  <small>Press Enter to see detailed results</small>
                </div>
              ) : null}
            </div>
          )}
        </form>
      </div>

      <div className="navbar-right">
        <ul className="navbar-links">
          <li>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Attractive Home SVG in black */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="url(#homeGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle' }}>
                <defs>
                  <linearGradient id="homeGradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <path d="M4 12L12 5l8 7"/>
                <rect x="6" y="12" width="12" height="8" rx="2" fill="#fff" stroke="url(#homeGradient)"/>
                <path d="M9 16h6" stroke="url(#homeGradient)" strokeWidth="1.5"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>Home</span>
            </Link>
          </li>
          <li>
            <Link to="/about" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Modern About SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#aboutGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="aboutGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4"/>
                <path d="M12 8h.01"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>About</span>
            </Link>
          </li>
          <li>
            <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
              {/* Modern Cart SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#cartGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="cartGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>Cart</span>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -8,
                    right: -16,
                    background: '#059669',
                    color: '#fff',
                    borderRadius: '50%',
                    fontSize: 12,
                    minWidth: 18,
                    height: 18,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 5px',
                    fontWeight: 700,
                    zIndex: 2
                  }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          </li>
          <li>
            <Link to="/contact" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {/* Modern Contact SVG in black */}
              <svg width="22" height="22" fill="none" stroke="url(#contactGradient)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <defs>
                  <linearGradient id="contactGradient" x1="0" y1="0" x2="22" y2="0" gradientUnits="userSpaceOnUse">
                    <stop offset="60%" stop-color="rgb(99, 102, 241)" />
                    <stop offset="100%" stop-color="rgb(15, 227, 171)" />
                  </linearGradient>
                </defs>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ color: '#111', fontWeight: 600 }}>ContactUs</span>
            </Link>
          </li>
        </ul>

        {/* Right side auth control */}
        <div style={{ marginLeft: '20px' }}>
          {isLoggedIn ? (
            <UserDropdown />
          ) : (
            <button
              className="navbar-login-btn"
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(11, 113, 18, 1)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 24px',
                fontWeight: 600,
                fontSize: '1rem',
                boxShadow: '0 2px 8px rgba(99,102,241,0.09)',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
