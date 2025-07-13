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

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, it might be HTML error page
      const text = await response.text();
      console.log('Non-JSON response:', text.substring(0, 200));
      throw new Error(`Server returned non-JSON response. Status: ${response.status}`);
    }

    console.log('API response status:', response.status);
    console.log('API response data:', data);

    if (!response.ok) {
      // If unauthorized, clear the token
      if (response.status === 401 || response.status === 403) {
        console.log('Authentication failed, clearing token');
        removeAuthToken();
      }
      throw new Error(data.error || `API call failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    // If it's a JSON parsing error, provide a more helpful message
    if (error.message.includes('Unexpected token')) {
      throw new Error('Server is not responding with valid data. Please check if the backend server is running.');
    }
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
    try {
      // Mock API call - save to localStorage for now
      const orderId = 'ORD' + Date.now();
      const orderNumber = 'PH' + Math.random().toString(36).substr(2, 8).toUpperCase();

      const order = {
        _id: orderId,
        orderNumber: orderNumber,
        ...orderData,
        orderStatus: orderData.paymentMethod === 'Cash On Delivery' ? 'Confirmed' : 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Get existing orders
      const existingOrders = JSON.parse(localStorage.getItem('user_orders') || '[]');

      // Add new order
      existingOrders.push(order);

      // Save back to localStorage
      localStorage.setItem('user_orders', JSON.stringify(existingOrders));

      return {
        success: true,
        order: order,
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('Order creation error:', error);
      return {
        success: false,
        error: 'Failed to create order'
      };
    }
  },

  getUserOrders: async (page = 1, limit = 10) => {
    try {
      // Mock API call - get from localStorage
      const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');

      // Sort by creation date (newest first)
      const sortedOrders = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // Implement pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedOrders = sortedOrders.slice(startIndex, endIndex);

      return {
        success: true,
        orders: paginatedOrders,
        totalOrders: orders.length,
        currentPage: page,
        totalPages: Math.ceil(orders.length / limit)
      };
    } catch (error) {
      console.error('Get orders error:', error);
      return {
        success: false,
        error: 'Failed to fetch orders'
      };
    }
  },

  getOrder: async (orderId) => {
    return await apiCall(`/orders/${orderId}`);
  },

  cancelOrder: async (orderId) => {
    try {
      // Mock API call - update in localStorage
      const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');

      // Find and update the order
      const orderIndex = orders.findIndex(order => order._id === orderId);

      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          orderStatus: 'Cancelled',
          updatedAt: new Date().toISOString()
        };

        // Save back to localStorage
        localStorage.setItem('user_orders', JSON.stringify(orders));

        return {
          success: true,
          order: orders[orderIndex],
          message: 'Order cancelled successfully'
        };
      } else {
        return {
          success: false,
          error: 'Order not found'
        };
      }
    } catch (error) {
      console.error('Cancel order error:', error);
      return {
        success: false,
        error: 'Failed to cancel order'
      };
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    try {
      // Mock API call - update in localStorage
      const orders = JSON.parse(localStorage.getItem('user_orders') || '[]');

      // Find and update the order
      const orderIndex = orders.findIndex(order => order._id === orderId);

      if (orderIndex !== -1) {
        orders[orderIndex] = {
          ...orders[orderIndex],
          ...statusData,
          updatedAt: new Date().toISOString()
        };

        // Save back to localStorage
        localStorage.setItem('user_orders', JSON.stringify(orders));

        return {
          success: true,
          order: orders[orderIndex],
          message: 'Order status updated successfully'
        };
      } else {
        return {
          success: false,
          error: 'Order not found'
        };
      }
    } catch (error) {
      console.error('Update order status error:', error);
      return {
        success: false,
        error: 'Failed to update order status'
      };
    }
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

// Admin API calls
export const adminAPI = {
  // Get all orders for admin
  getAllOrders: async (page = 1, limit = 20, status = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status })
      });

      return await apiCall(`/orders/admin/all?${queryParams}`);
    } catch (error) {
      // Fallback to regular orders endpoint if admin endpoint fails
      console.log('Admin orders endpoint failed, using fallback');
      return await apiCall(`/orders?${new URLSearchParams({ page: page.toString(), limit: limit.toString() })}`);
    }
  },

  // Get all appointments for admin
  getAllAppointments: async (page = 1, limit = 20, status = '', date = '') => {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(status && { status }),
        ...(date && { date })
      });

      return await apiCall(`/appointments/admin/all?${queryParams}`);
    } catch (error) {
      // Fallback to regular appointments endpoint if admin endpoint fails
      console.log('Admin appointments endpoint failed, using fallback');
      return await apiCall(`/appointments?${new URLSearchParams({ page: page.toString(), limit: limit.toString() })}`);
    }
  },

  // Get all medical records for admin
  getAllMedicalRecords: async () => {
    // For now, get from localStorage since we're using simplified version
    const allRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    return {
      success: true,
      records: allRecords
    };
  },

  // Update order status
  updateOrder: async (orderId, updateData) => {
    return await apiCall(`/orders/admin/${orderId}/update`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Update appointment status
  updateAppointment: async (appointmentId, updateData) => {
    return await apiCall(`/appointments/admin/${appointmentId}/update`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    try {
      const [ordersResponse, appointmentsResponse] = await Promise.all([
        adminAPI.getAllOrders(1, 100),
        adminAPI.getAllAppointments(1, 100)
      ]);

      const medicalRecordsResponse = await adminAPI.getAllMedicalRecords();

      return {
        success: true,
        stats: {
          totalOrders: ordersResponse.pagination?.totalOrders || 0,
          totalAppointments: appointmentsResponse.pagination?.totalAppointments || 0,
          totalMedicalRecords: medicalRecordsResponse.records?.length || 0,
          pendingOrders: ordersResponse.orders?.filter(o => o.orderStatus === 'Placed').length || 0,
          pendingAppointments: appointmentsResponse.appointments?.filter(a => a.appointmentStatus === 'Scheduled').length || 0
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
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
