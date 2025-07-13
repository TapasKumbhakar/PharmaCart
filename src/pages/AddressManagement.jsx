import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './AddressManagement.css';

export default function AddressManagement() {
  const [addresses, setAddresses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    type: 'Home',
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  });
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  // Load addresses from localStorage on component mount
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    loadAddresses();
  }, [isLoggedIn, navigate]);

  const loadAddresses = () => {
    const savedAddresses = localStorage.getItem(`addresses_${user?.email || 'user'}`);
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  };

  const saveAddresses = (newAddresses) => {
    localStorage.setItem(`addresses_${user?.email || 'user'}`, JSON.stringify(newAddresses));
    setAddresses(newAddresses);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.zipCode) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please fill in all required fields.',
        timer: 2000,
        showConfirmButton: false
      });
      return;
    }

    const newAddress = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now().toString(),
      createdAt: editingAddress ? editingAddress.createdAt : new Date().toISOString()
    };

    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = addresses.map(addr => 
        addr.id === editingAddress.id ? newAddress : addr
      );
    } else {
      updatedAddresses = [...addresses, newAddress];
    }

    // If this is set as default, remove default from others
    if (newAddress.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === newAddress.id
      }));
    }

    saveAddresses(updatedAddresses);
    
    Swal.fire({
      icon: 'success',
      title: editingAddress ? 'Address Updated!' : 'Address Added!',
      text: `Your address has been ${editingAddress ? 'updated' : 'added'} successfully.`,
      timer: 2000,
      showConfirmButton: false
    });

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'Home',
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    });
    setShowAddForm(false);
    setEditingAddress(null);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingAddress(address);
    setShowAddForm(true);
  };

  const handleDelete = async (addressId) => {
    const result = await Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      saveAddresses(updatedAddresses);
      
      Swal.fire({
        icon: 'success',
        title: 'Address Deleted',
        text: 'Your address has been deleted successfully.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const handleSetDefault = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    saveAddresses(updatedAddresses);
    
    Swal.fire({
      icon: 'success',
      title: 'Default Address Updated',
      text: 'This address is now your default address.',
      timer: 1500,
      showConfirmButton: false
    });
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="address-management">
      <div className="address-header">
        <h1>Manage Addresses</h1>
        <button 
          className="btn-add-address"
          onClick={() => setShowAddForm(true)}
        >
          + Add New Address
        </button>
      </div>

      {/* Address Form */}
      {showAddForm && (
        <div className="address-form-overlay">
          <div className="address-form-container">
            <div className="address-form-header">
              <h2>{editingAddress ? 'Edit Address' : 'Add New Address'}</h2>
              <button 
                className="btn-close"
                onClick={resetForm}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="address-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Address Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Street Address *</label>
                <textarea
                  name="street"
                  value={formData.street}
                  onChange={handleInputChange}
                  placeholder="Enter complete street address"
                  rows={3}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Country *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default address
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="address-list">
        {addresses.length === 0 ? (
          <div className="no-addresses">
            <div className="no-addresses-icon">📍</div>
            <h3>No addresses added yet</h3>
            <p>Add your first address to get started with deliveries.</p>
            <button 
              className="btn-add-first"
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          addresses.map(address => (
            <div key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              <div className="address-header-card">
                <div className="address-type">
                  <span className="type-badge">{address.type}</span>
                  {address.isDefault && <span className="default-badge">Default</span>}
                </div>
                <div className="address-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(address)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="address-details">
                <h4>{address.fullName}</h4>
                <p>{address.street}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
                <p className="phone">📞 {address.phone}</p>
              </div>

              {!address.isDefault && (
                <button 
                  className="btn-set-default"
                  onClick={() => handleSetDefault(address.id)}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
