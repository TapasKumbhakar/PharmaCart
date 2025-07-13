const API_BASE_URL = 'http://localhost:4242/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token) => {
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Create headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: getAuthHeaders(),
    ...options
  };

  try {
    console.log('Making API call to:', url);
    console.log('Headers:', config.headers);

    const response = await fetch(url, config);
    const data = await response.json();

    console.log('API response status:', response.status);
    console.log('API response data:', data);

    if (!response.ok) {
      // If unauthorized, clear the token
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, clearing token');
        removeAuthToken();
      }
      throw new Error(data.error || 'API call failed');
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  register: async (userData) => {
    const response = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (response.token) {
      setAuthToken(response.token);
    }
    
    return response;
  },

  logout: () => {
    removeAuthToken();
  },

  getProfile: async () => {
    return await apiCall('/auth/profile');
  },

  updateProfile: async (profileData) => {
    return await apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }
};

// Order API calls
export const orderAPI = {
  createOrder: async (orderData) => {
    return await apiCall('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  },

  getUserOrders: async (page = 1, limit = 10) => {
    return await apiCall(`/orders/my-orders?page=${page}&limit=${limit}`);
  },

  getOrder: async (orderId) => {
    return await apiCall(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId) => {
    return await apiCall(`/orders/${orderId}/cancel`, {
      method: 'PUT'
    });
  }
};

// Appointment API calls
export const appointmentAPI = {
  createAppointment: async (appointmentData) => {
    return await apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointmentData)
    });
  },

  getUserAppointments: async (page = 1, limit = 10) => {
    return await apiCall(`/appointments/my-appointments?page=${page}&limit=${limit}`);
  },

  getAppointment: async (appointmentId) => {
    return await apiCall(`/appointments/${appointmentId}`);
  },

  cancelAppointment: async (appointmentId) => {
    return await apiCall(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT'
    });
  },

  rescheduleAppointment: async (appointmentId, newDate) => {
    return await apiCall(`/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ preferredDate: newDate })
    });
  }
};

// Utility functions
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Medical Records API calls
export const medicalRecordAPI = {
  uploadRecord: async (recordData) => {
    return await apiCall('/medical-records/upload', {
      method: 'POST',
      body: JSON.stringify(recordData)
    });
  },

  getUserRecords: async (page = 1, limit = 10, recordType = '') => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(recordType && { recordType })
    });

    return await apiCall(`/medical-records?${queryParams}`);
  },

  getRecord: async (recordId) => {
    return await apiCall(`/medical-records/${recordId}`);
  },

  downloadRecord: async (recordId) => {
    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/medical-records/${recordId}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    return response.blob();
  },

  deleteRecord: async (recordId) => {
    return await apiCall(`/medical-records/${recordId}`, {
      method: 'DELETE'
    });
  }
};

export const getCurrentUserId = () => {
  const token = getAuthToken();
  if (!token) return null;

  try {
    // Decode JWT token to get user ID (basic decode, not secure validation)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
