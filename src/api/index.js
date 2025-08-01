import axios from 'axios';
import { store } from '../store';
import { logoutUser } from '../store/slices/authSlice';

// Dynamic API Configuration
const getApiBaseUrl = () => {
  // Check if we're in production (on render.com)
  if (window.location.hostname.includes('onrender.com') || window.location.protocol === 'https:') {
    return 'https://server-b6ns.onrender.com/api';
  }
  // Development fallback
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Create axios instance with enhanced configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication and caching
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add device info for enhanced tracking
    config.headers['X-Device-Info'] = JSON.stringify({
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    });

    // Add cache control for GET requests
    if (config.method === 'get' && config.cacheKey) {
      const cachedData = sessionStorage.getItem(`cache_${config.cacheKey}`);
      if (cachedData) {
        const { data, timestamp, ttl } = JSON.parse(cachedData);
        if (Date.now() - timestamp < ttl) {
          // Return cached data
          return Promise.resolve({
            data: data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config: config,
            request: {}
          });
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and caching
apiClient.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.config.cacheKey) {
      const cacheData = {
        data: response.data,
        timestamp: Date.now(),
        ttl: response.config.cacheTtl || 300000 // 5 minutes default
      };
      try {
        sessionStorage.setItem(`cache_${response.config.cacheKey}`, JSON.stringify(cacheData));
      } catch (error) {
        console.warn('Cache storage failed:', error);
      }
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh token
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          });

          if (refreshResponse.data.success) {
            localStorage.setItem('token', refreshResponse.data.token);
            originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }

      // Only logout if it's not a login or OTP verification request
      const isAuthRequest = originalRequest.url?.includes('/auth/login') || 
                           originalRequest.url?.includes('/auth/verify-login-otp') ||
                           originalRequest.url?.includes('/auth/register');
      
      if (!isAuthRequest) {
        store.dispatch(logoutUser());
      }
      return Promise.reject(error);
    }

    // Handle 403 errors (forbidden)
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 429 errors (rate limited)
    if (error.response?.status === 429) {
      console.warn('Rate limited:', error.response.data);
      // Could implement exponential backoff here
    }

    // Handle 500+ errors (server errors)
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// Enhanced API service with caching and better error handling
const apiService = {
  // Set auth token for all future requests
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common.Authorization;
    }
  },

  // Clear all cached data
  clearCache: () => {
    try {
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Cache clearing failed:', error);
    }
  },

  // Auth endpoints
  auth: {
    login: async (credentials) => {
      try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login failed');
      }
    },

    register: async (userData) => {
      try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Registration failed');
      }
    },

    verifyOTP: async (otpData) => {
      try {
        const response = await apiClient.post('/auth/verify-otp', otpData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'OTP verification failed');
      }
    },

    verifyLoginOTP: async (otpData) => {
      try {
        const response = await apiClient.post('/auth/verify-login-otp', otpData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login OTP verification failed');
      }
    },

    getProfile: async () => {
      try {
        const response = await apiClient.get('/auth/profile', {
          cacheKey: 'user_profile',
          cacheTtl: 300000 // 5 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
      }
    },

    logout: async () => {
      try {
        const response = await apiClient.post('/auth/logout');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Logout failed');
      }
    },

    refreshToken: async () => {
      try {
        const response = await apiClient.post('/auth/refresh');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Token refresh failed');
      }
    },

    getTier: async () => {
      try {
        const response = await apiClient.get('/auth/tier', {
          cacheKey: 'user_tier',
          cacheTtl: 600000 // 10 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tier');
      }
    },

    upgradeTier: async (tierData) => {
      try {
        const response = await apiClient.post('/auth/upgrade-tier', tierData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to upgrade tier');
      }
    },

    getDevices: async () => {
      try {
        const response = await apiClient.get('/auth/devices', {
          cacheKey: 'user_devices',
          cacheTtl: 300000 // 5 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch devices');
      }
    },

    updateProfile: async (profileData) => {
      try {
        const response = await apiClient.put('/auth/profile', profileData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
    },

    updateSettings: async (settingsData) => {
      try {
        const response = await apiClient.put('/auth/settings', settingsData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update settings');
      }
    }
  },

  // Voucher endpoints
  vouchers: {
    getAll: async () => {
      try {
        const response = await apiClient.get('/vouchers', {
          cacheKey: 'vouchers_list',
          cacheTtl: 120000 // 2 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch vouchers');
      }
    },

    getById: async (id) => {
      try {
        const response = await apiClient.get(`/vouchers/${id}`, {
          cacheKey: `voucher_${id}`,
          cacheTtl: 300000 // 5 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch voucher');
      }
    },

    create: async (voucherData) => {
      try {
        const response = await apiClient.post('/vouchers', voucherData);
        // Clear vouchers cache after creation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create voucher');
      }
    },

    createWorkOrder: async (voucherData) => {
      try {
        const response = await apiClient.post('/vouchers/work-order', voucherData);
        // Clear vouchers cache after creation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create work order voucher');
      }
    },

    createPurchaseEscrow: async (voucherData) => {
      try {
        const response = await apiClient.post('/vouchers/purchase-escrow', voucherData);
        // Clear vouchers cache after creation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create purchase escrow voucher');
      }
    },

    createPrepaid: async (voucherData) => {
      try {
        const response = await apiClient.post('/vouchers/prepaid', voucherData);
        // Clear vouchers cache after creation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create prepaid voucher');
      }
    },

    createGiftCard: async (voucherData) => {
      try {
        const response = await apiClient.post('/vouchers/gift-card', voucherData);
        // Clear vouchers cache after creation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create gift card voucher');
      }
    },

    redeem: async (redeemData) => {
      try {
        const response = await apiClient.post('/vouchers/redeem', redeemData);
        // Clear vouchers cache after redemption
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to redeem voucher');
      }
    },

    redeemVoucher: async (redeemData) => {
      try {
        const response = await apiClient.post('/vouchers/redeem', redeemData);
        // Clear vouchers cache after redemption
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to redeem voucher');
      }
    },

    confirmCancel: async (voucherId) => {
      try {
        console.log('🔍 API: Confirming cancellation for voucher:', voucherId);
        console.log('🔍 API: Request payload:', { voucherId });
        const response = await apiClient.post('/vouchers/confirm-cancel', { voucherId });
        console.log('🔍 API: Confirm cancel response:', response.data);
        // Clear vouchers cache after cancellation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        console.error('❌ API: Confirm cancel error:', error);
        console.error('❌ API: Error response:', error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to confirm cancellation');
      }
    },

    requestRedemptionOTP: async (voucherCode) => {
      try {
        const response = await apiClient.post('/vouchers/request-redemption-otp', { voucherCode });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to request redemption OTP');
      }
    },

    verifyRedemptionOTP: async (voucherCode, otp) => {
      try {
        const response = await apiClient.post('/vouchers/verify-redemption-otp', { voucherCode, otp });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to verify redemption OTP');
      }
    },

    cancel: async (cancelData) => {
      try {
        const response = await apiClient.post('/vouchers/cancel', cancelData);
        // Clear vouchers cache after cancellation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to cancel voucher');
      }
    },

    activate: async (activateData) => {
      try {
        const response = await apiClient.post('/vouchers/activate', activateData);
        // Clear vouchers cache after activation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to activate voucher');
      }
    },

    activateVoucher: async (voucherId) => {
      try {
        const response = await apiClient.post('/vouchers/activate', { voucherId });
        // Clear vouchers cache after activation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to activate voucher');
      }
    },

    cancelVoucher: async (voucherId, reason) => {
      try {
        const response = await apiClient.post('/vouchers/cancel', { voucherId, reason });
        // Clear vouchers cache after cancellation
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to cancel voucher');
      }
    },

    releaseMilestone: async (voucherId) => {
      try {
        const response = await apiClient.post('/vouchers/release-milestone', { voucherId });
        // Clear vouchers cache after milestone release
        apiService.clearCache();
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to release milestone');
      }
    },

    getBalance: async () => {
      try {
        const response = await apiClient.get('/vouchers/balance', {
          cacheKey: 'user_balance',
          cacheTtl: 60000 // 1 minute
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch balance');
      }
    },

    searchByCode: async (voucherCode) => {
      try {
        const response = await apiClient.get(`/vouchers/search/${voucherCode}`, {
          cacheKey: `voucher_search_${voucherCode}`,
          cacheTtl: 300000 // 5 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to search voucher');
      }
    },

    uploadVoucher: async (formData) => {
      try {
        const response = await apiClient.post('/vouchers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to upload voucher');
      }
    }
  },

  // Theme endpoints
  themes: {
    getByVoucherType: async (voucherType) => {
      try {
        console.log(`🎨 API: Fetching themes for ${voucherType}`);
        const response = await apiClient.get(`/themes/${voucherType}`, {
          cacheKey: `themes_${voucherType}`,
          cacheTtl: 300000 // 5 minutes
        });
        console.log(`🎨 API: Response for ${voucherType}:`, response.data);
        return response.data;
      } catch (error) {
        console.error(`🎨 API: Error fetching themes for ${voucherType}:`, error);
        console.error(`🎨 API: Error response:`, error.response?.data);
        throw new Error(error.response?.data?.message || 'Failed to fetch themes');
      }
    }
  },

  // Transaction endpoints
  transactions: {
    getAll: async () => {
      try {
        const response = await apiClient.get('/transactions', {
          cacheKey: 'transactions_list',
          cacheTtl: 120000 // 2 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
      }
    }
  }
};

export default apiService; 