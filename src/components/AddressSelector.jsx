import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import './AddressSelector.css';

export default function AddressSelector({ onAddressSelect, selectedAddressId, showAddForm = true }) {
  const [addresses, setAddresses] = useState([]);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
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
  const { user } = useAuth();

  useEffect(() => {
    loadAddresses();
  }, [user]);

  const loadAddresses = () => {
    try {
      const savedAddresses = localStorage.getItem(`addresses_${user?.email || 'user'}`);
      if (savedAddresses) {
        const addressList = JSON.parse(savedAddresses);
        setAddresses(addressList);

        // Auto-select default address if no address is selected
        if (!selectedAddressId) {
          const defaultAddress = addressList.find(addr => addr.isDefault);
          if (defaultAddress && onAddressSelect) {
            onAddressSelect(defaultAddress);
          }
        }
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
      Swal.fire({
        icon: 'error',
        title: 'Error Loading Addresses',
        text: 'There was an issue loading your saved addresses.',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const saveAddresses = (newAddresses) => {
    try {
      localStorage.setItem(`addresses_${user?.email || 'user'}`, JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error saving addresses:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error Saving Address',
        text: 'There was an issue saving your address. Please try again.',
        timer: 3000,
        showConfirmButton: false
      });
    }
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

    // Basic validation
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

    // Phone number validation (basic Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Phone Number',
        text: 'Please enter a valid 10-digit Indian mobile number.',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    // ZIP code validation (Indian postal code format)
    const zipRegex = /^[1-9][0-9]{5}$/;
    if (!zipRegex.test(formData.zipCode)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid ZIP Code',
        text: 'Please enter a valid 6-digit Indian postal code.',
        timer: 3000,
        showConfirmButton: false
      });
      return;
    }

    const addressData = {
      ...formData,
      id: editingAddress ? editingAddress.id : Date.now().toString(),
      createdAt: editingAddress ? editingAddress.createdAt : new Date().toISOString()
    };

    let updatedAddresses;
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id ? addressData : addr
      );
    } else {
      // Add new address
      updatedAddresses = [...addresses, addressData];
    }

    // If this is set as default, remove default from others
    if (addressData.isDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressData.id
      }));
    }

    saveAddresses(updatedAddresses);

    // Auto-select the newly added/updated address
    if (onAddressSelect) {
      onAddressSelect(addressData);
    }

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
    setShowNewAddressForm(false);
    setEditingAddress(null);
  };

  const handleAddressSelect = (address) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  const handleEditAddress = (address) => {
    setFormData({
      type: address.type,
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    });
    setEditingAddress(address);
    setShowNewAddressForm(true);
  };

  const handleDeleteAddress = (addressId) => {
    Swal.fire({
      title: 'Delete Address?',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
        saveAddresses(updatedAddresses);

        Swal.fire({
          icon: 'success',
          title: 'Address Deleted!',
          text: 'The address has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <div className="address-selector">
      <div className="address-selector-header">
        <h3>Select Delivery Address</h3>
        {showAddForm && (
          <button 
            className="btn-add-new-address"
            onClick={() => setShowNewAddressForm(true)}
          >
            + Add New Address
          </button>
        )}
      </div>

      {/* New Address Form */}
      {showNewAddressForm && (
        <div className="new-address-form">
          <div className="form-header">
            <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
            <button
              className="btn-close-form"
              onClick={resetForm}
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="address-form-compact">
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
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

            <div className="form-group">
              <label>Street Address *</label>
              <textarea
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter complete street address"
                rows={2}
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
              <div className="form-group">
                <label>ZIP Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP code"
                  required
                />
              </div>
            </div>

            <div className="form-actions-compact">
              <button type="button" onClick={resetForm} className="btn-cancel-compact">
                Cancel
              </button>
              <button type="submit" className="btn-save-compact">
                {editingAddress ? 'Update Address' : 'Save Address'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      <div className="address-list-selector">
        {addresses.length === 0 ? (
          <div className="no-addresses-selector">
            <p>No addresses found. Please add a delivery address.</p>
            {showAddForm && (
              <button 
                className="btn-add-first-address"
                onClick={() => setShowNewAddressForm(true)}
              >
                Add Your First Address
              </button>
            )}
          </div>
        ) : (
          addresses.map(address => (
            <div 
              key={address.id} 
              className={`address-card-selector ${selectedAddressId === address.id ? 'selected' : ''}`}
              onClick={() => handleAddressSelect(address)}
            >
              <div className="address-radio">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddressId === address.id}
                  onChange={() => handleAddressSelect(address)}
                />
              </div>
              
              <div className="address-info">
                <div className="address-header-selector">
                  <span className="address-type-badge">{address.type}</span>
                  {address.isDefault && <span className="default-badge-selector">Default</span>}
                </div>

                <div className="address-details-selector">
                  <h4>{address.fullName}</h4>
                  <p>{address.street}</p>
                  <p>{address.city}, {address.state} {address.zipCode}</p>
                  <p className="phone-selector">📞 {address.phone}</p>
                </div>
              </div>

              <div className="address-actions-selector">
                <button
                  className="btn-edit-address-selector"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                  title="Edit Address"
                >
                  ✏️
                </button>
                <button
                  className="btn-delete-address-selector"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
                  title="Delete Address"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
