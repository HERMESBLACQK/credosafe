// API Configuration and Service
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === "undefined" || token === undefined) {
    console.log('🔍 Getting token from localStorage:', 'No valid token found');
    return null;
  }
  console.log('🔍 Getting token from localStorage:', 'Token found');
  return token;
};

// Helper function to set auth token in localStorage
const setAuthToken = (token) => {
  if (token && token !== "undefined" && token !== undefined) {
    localStorage.setItem('token', token);
    console.log('💾 Setting token in localStorage:', 'Token saved');
  } else {
    localStorage.removeItem('token');
    console.log('🗑️ Removed invalid token from localStorage');
  }
};

// Helper function to remove auth token from localStorage
const removeAuthToken = () => {
  console.log('🗑️ Removing token from localStorage');
  localStorage.removeItem('token');
};

// Base API request function (without authentication)
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle successful responses
    if (response.ok) {
      return { success: true, data };
    }

    // Handle error responses
    return { 
      success: false, 
      error: data.message || data.error || data || 'An error occurred',
      status: response.status,
      data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Network error occurred',
      status: 0 
    };
  }
};

// Authenticated API request function (with token)
const authenticatedApiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Default headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token
  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
    console.log('🔐 Sending authenticated request:');
    console.log('📍 URL:', url);
    console.log('🔑 Token:', token.substring(0, 20) + '...');
    console.log('📋 Headers:', headers);
    console.log('📦 Body:', options.body || 'No body');
  } else {
    console.log('⚠️ No token available for Authorization header');
    console.log('🔐 Sending unauthenticated request:');
    console.log('📍 URL:', url);
    console.log('📋 Headers:', headers);
    console.log('📦 Body:', options.body || 'No body');
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle different response types
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // Handle successful responses
    if (response.ok) {
      return { success: true, data };
    }

    // Handle error responses
    return { 
      success: false, 
      error: data.message || data.error || data || 'An error occurred',
      status: response.status,
      data 
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message || 'Network error occurred',
      status: 0 
    };
  }
};

// API Service Methods
export const apiService = {
  // Authentication endpoints
  auth: {
    // Register new user (no auth required)
    register: async (userData) => {
      return apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    // Login user (no auth required)
    login: async (credentials) => {
      return apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },

    // Verify OTP (no auth required)
    verifyOTP: async (otpData) => {
      return apiRequest('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(otpData)
      });
    },

    // Resend OTP (no auth required)
    resendOTP: async (email) => {
      return apiRequest('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    },

    // Get user profile (auth required)
    getProfile: async () => {
      return authenticatedApiRequest('/auth/profile');
    },

    // Change password (auth required)
    changePassword: async (passwordData) => {
      return authenticatedApiRequest('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData)
      });
    },

    // Logout user (auth required)
    logout: async () => {
      return authenticatedApiRequest('/auth/logout', {
        method: 'POST'
      });
    },

    // Get user devices (auth required)
    getDevices: async () => {
      return authenticatedApiRequest('/auth/devices');
    },

    // Update user profile (auth required)
    updateProfile: async (profileData) => {
      return authenticatedApiRequest('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    // Update user settings (auth required)
    updateSettings: async (settingsData) => {
      return authenticatedApiRequest('/auth/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData)
      });
    },

    // Send OTP for password change (auth required)
    sendPasswordOTP: async () => {
      return authenticatedApiRequest('/auth/send-password-otp', {
        method: 'POST'
      });
    },

    // Get user tier information (auth required)
    getTier: async () => {
      return authenticatedApiRequest('/auth/tier');
    },

    // Upgrade user tier (auth required)
    upgradeTier: async (tierData) => {
      return authenticatedApiRequest('/auth/upgrade-tier', {
        method: 'POST',
        body: JSON.stringify(tierData)
      });
    }
  },

  // Credentials endpoints (all require authentication)
  credentials: {
    // Get all credentials for user
    getAll: async (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      const endpoint = queryParams ? `/credentials?${queryParams}` : '/credentials';
      return authenticatedApiRequest(endpoint);
    },

    // Get single credential
    getById: async (id) => {
      return authenticatedApiRequest(`/credentials/${id}`);
    },

    // Create new credential
    create: async (credentialData) => {
      return authenticatedApiRequest('/credentials', {
        method: 'POST',
        body: JSON.stringify(credentialData)
      });
    },

    // Update credential
    update: async (id, credentialData) => {
      return authenticatedApiRequest(`/credentials/${id}`, {
        method: 'PUT',
        body: JSON.stringify(credentialData)
      });
    },

    // Delete credential
    delete: async (id) => {
      return authenticatedApiRequest(`/credentials/${id}`, {
        method: 'DELETE'
      });
    },

    // Toggle favorite status
    toggleFavorite: async (id) => {
      return authenticatedApiRequest(`/credentials/${id}/favorite`, {
        method: 'PATCH'
      });
    },

    // Search credentials
    search: async (query) => {
      return authenticatedApiRequest(`/credentials/search?q=${encodeURIComponent(query)}`);
    },

    // Get credentials statistics
    getStats: async () => {
      return authenticatedApiRequest('/credentials/stats');
    }
  },

  // Categories endpoints (all require authentication)
  categories: {
    // Get all categories for user
    getAll: async () => {
      return authenticatedApiRequest('/categories');
    },

    // Create new category
    create: async (categoryData) => {
      return authenticatedApiRequest('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
    },

    // Update category
    update: async (id, categoryData) => {
      return authenticatedApiRequest(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
    },

    // Delete category
    delete: async (id) => {
      return authenticatedApiRequest(`/categories/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // User management endpoints (admin only - all require authentication)
  users: {
    // Get all users (admin)
    getAll: async () => {
      return authenticatedApiRequest('/users');
    },

    // Get user by ID (admin)
    getById: async (id) => {
      return authenticatedApiRequest(`/users/${id}`);
    },

    // Update user (admin)
    update: async (id, userData) => {
      return authenticatedApiRequest(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    },

    // Delete user (admin)
    delete: async (id) => {
      return authenticatedApiRequest(`/users/${id}`, {
        method: 'DELETE'
      });
    },

    // Get user statistics (admin)
    getStats: async () => {
      return authenticatedApiRequest('/users/stats');
    }
  }
};

// Utility functions
export const apiUtils = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated: () => !!getAuthToken(),
  logout: () => {
    removeAuthToken();
    // You can add additional logout logic here
  }
};

// Export default API service
export default apiService; 