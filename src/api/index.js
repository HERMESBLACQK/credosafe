import axios from 'axios';
import { store } from '../store';
import { logoutUser } from '../store/slices/authSlice';
import { 
  isSensitiveEndpoint, 
  getSecurityHeaders, 
  secureTokenStorage, 
  clearSensitiveCache,
  sanitizeForLogging 
} from '../utils/security';

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

// Create axios instance with enhanced security configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    // Security headers to prevent caching of sensitive data
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'Pragma': 'no-cache',
    'Expires': '0',
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  },
  // Add these to fix CORS and header issues
  withCredentials: false,
  validateStatus: function (status) {
    return status >= 200 && status < 300; // Accept all 2xx status codes
  }
});

// Request interceptor for authentication and security
apiClient.interceptors.request.use(
  (config) => {
    // Ensure headers object exists
    if (!config.headers) {
      config.headers = {};
    }

    // Add auth token if available (but don't cache it)
    const token = secureTokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // Add additional security for token requests
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    // Add device info for enhanced tracking (only if not already set)
    if (!config.headers['X-Device-Info']) {
      config.headers['X-Device-Info'] = JSON.stringify({
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform
      });
    }

    // Force no-cache for sensitive endpoints
    const isSensitive = isSensitiveEndpoint(config.url);

    if (isSensitive) {
      // Add security headers for sensitive endpoints
      Object.assign(config.headers, getSecurityHeaders());
      // Don't cache sensitive requests
      config.cacheKey = null;
    }

    // Add cache control for non-sensitive GET requests only
    if (config.method === 'get' && config.cacheKey && !isSensitive) {
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
    // Sanitize sensitive data before logging
    console.log('📡 API Response:', sanitizeForLogging(response.data));
    
    // Only cache non-sensitive GET responses
    if (response.config.method === 'get' && response.config.cacheKey && !isSensitiveEndpoint(response.config.url)) {
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
        const refreshToken = secureTokenStorage.getRefreshToken();
        if (!refreshToken) {
          // If no refresh token, logout immediately.
          store.dispatch(logoutUser());
          return Promise.reject(new Error("Session expired. No refresh token available."));
        }

        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        if (refreshResponse.data.success) {
          const { token, refreshToken: newRefreshToken } = refreshResponse.data;
          
          // Update tokens in secure storage
          secureTokenStorage.setToken(token);
          if (newRefreshToken) {
            secureTokenStorage.setRefreshToken(newRefreshToken);
          }

          // Update the header of the original request and retry it
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // If refresh fails, logout the user
        store.dispatch(logoutUser());
        return Promise.reject(refreshError);
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
        const response = await apiClient.post('/auth/verify-login-otp', otpData, { cacheKey: null }); // No cache for OTP
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Login OTP verification failed');
      }
    },

    // --- Password Reset (Forgot Password) ---
    requestPasswordReset: async (data) => {
      try {
        const response = await apiClient.post('/auth/request-password-reset', data, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to request password reset');
      }
    },
    verifyPasswordResetOtp: async (data) => {
      try {
        const response = await apiClient.post('/auth/verify-reset-otp', data, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to verify OTP');
      }
    },
    resetPassword: async (data) => {
      try {
        const response = await apiClient.post('/auth/reset-password', data, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to reset password');
      }
    },

    // --- Password Change (Authenticated User) ---
    sendPasswordOTP: async () => {
      try {
        const response = await apiClient.post('/auth/send-password-otp', {}, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to send OTP');
      }
    },

    verifyPasswordOTP: async (otp) => {
      try {
        const response = await apiClient.post('/auth/verify-password-otp', { otp }, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to verify OTP');
      }
    },

    changePassword: async (data) => {
      try {
        const response = await apiClient.put('/auth/change-password', data, { cacheKey: null });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
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

    getTierLimits: async (tierLevel) => {
      try {
        const response = await apiClient.get(`/auth/tier-limits/${tierLevel}`, {
          cacheKey: `tier_limits_${tierLevel}`,
          cacheTtl: 3600000 // 1 hour
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch tier limits');
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

  // Public voucher endpoints (no auth)
  publicVouchers: {
    searchByCode: async (voucherCode) => {
      try {
        const response = await apiClient.get(`/public-vouchers/${voucherCode}`);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to search for voucher');
      }
    }
  },

  // Voucher endpoints
  vouchers: {
    // Get all vouchers
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

    // Get all transactions (voucher creations and redemptions)
    getTransactions: async (page = 1, limit = 50) => {
      try {
        const response = await apiClient.get(`/vouchers/transactions`, {
          cacheKey: `vouchers_transactions_${page}`,
          cacheTtl: 60000 // 1 minute
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch transactions');
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
        const response = await apiClient.post(`/vouchers/${voucherId}/confirm-cancel`);
        // Clear vouchers cache after cancellation
        apiService.clearCache();
        return response.data;
      } catch (error) {
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
  },

  // Payment endpoints
  payments: {
    // Initialize wallet funding
    fundWallet: async (paymentData) => {
      try {
        const response = await apiClient.post('/payments/fund-wallet', paymentData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to initialize payment');
      }
    },

    // Get wallet balance
    getWalletBalance: async () => {
      try {
        const response = await apiClient.get('/payments/wallet-balance', {
          cacheKey: 'wallet_balance',
          cacheTtl: 60000 // 1 minute
        });
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching wallet balance:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch wallet balance');
      }
    },

    // Get wallet transactions
    getWalletTransactions: async (page = 1, limit = 10) => {
      try {
        const response = await apiClient.get(`/payments/wallet-transactions?page=${page}&limit=${limit}`, {
          cacheKey: `wallet_transactions_${page}`,
          cacheTtl: 120000 // 2 minutes
        });
        console.log('📊 Wallet transactions response:', {
          success: response.success,
          data: response.data,
          pagination: response.data?.pagination
        });
        return response.data;
      } catch (error) {
        console.error('❌ Error fetching wallet transactions:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch wallet transactions');
      }
    },

    // Get list of banks
    getBanks: async () => {
      try {
        const response = await apiClient.get('/payments/banks');
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch banks');
      }
    },

    // Verify bank account
    verifyBankAccount: async (accountData) => {
      try {
        const response = await apiClient.post('/payments/verify-account', accountData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to verify bank account');
      }
    },

    // Initiate withdrawal
    withdraw: async (withdrawalData) => {
      try {
        const response = await apiClient.post('/payments/withdraw', withdrawalData);
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to initiate withdrawal');
      }
    },

    // Get withdrawal transactions
    getWithdrawals: async (page = 1, limit = 10) => {
      try {
        const response = await apiClient.get(`/payments/withdrawals?page=${page}&limit=${limit}`, {
          cacheKey: `withdrawals_${page}`,
          cacheTtl: 120000 // 2 minutes
        });
        return response.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch withdrawals');
      }
    }
  }
};

// Referral API methods
export const referralAPI = {
  // Get user's referral statistics
  getStats: () => apiClient.get('/referrals/stats'),
  
  // Validate referral code
  validateCode: (referralCode) => apiClient.post('/referrals/validate', { referralCode }),
  
  // Get referral settings
  getSettings: () => apiClient.get('/referrals/settings'),
  
  // Get user's referral earnings
  getEarnings: (page = 1, limit = 20) => apiClient.get(`/referrals/earnings?page=${page}&limit=${limit}`),
  
  // Get referred users
  getReferredUsers: (page = 1, limit = 20) => apiClient.get(`/referrals/referred-users?page=${page}&limit=${limit}`)
};

export default apiService; 