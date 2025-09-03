import axios from 'axios';
import { store } from '../store';
import { logoutUser } from '../store/slices/authSlice';
import { 
  isSensitiveEndpoint, 
  getSecurityHeaders, 
  secureTokenStorage, 
  sanitizeForLogging 
} from '../utils/security';
import apiResponseHandler from '../utils/apiResponseHandler';

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
  method: 'GET', // Default method
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
    try {
      // Ensure config is valid
      if (!config || typeof config !== 'object') {
        console.warn('⚠️ Invalid request config:', config);
        return config;
      }

      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {};
      }

      // Ensure URL is properly set
      if (!config.url) {
        console.warn('⚠️ Request config missing URL:', config);
        return config;
      }

      // Ensure method is properly set
      if (!config.method) {
        config.method = 'get'; // Default to GET
      }
      
      // Ensure method is a string and uppercase
      if (typeof config.method !== 'string') {
        config.method = 'get';
      }
      config.method = config.method.toUpperCase();

      // Add auth token if available (but don't cache it)
      const token = secureTokenStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // Add additional security for token requests
        config.headers['X-Requested-With'] = 'XMLHttpRequest';
      }

      // Add device info for enhanced tracking (only if not already set)
      if (!config.headers['X-Device-Info']) {
        try {
          config.headers['X-Device-Info'] = JSON.stringify({
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            language: navigator.language,
            platform: navigator.platform
          });
        } catch (error) {
          console.warn('⚠️ Failed to add device info:', error);
        }
      }

      // Force no-cache for sensitive endpoints
      const isSensitive = isSensitiveEndpoint(config.url);

      if (isSensitive) {
        // Add security headers for sensitive endpoints
        try {
          Object.assign(config.headers, getSecurityHeaders());
        } catch (error) {
          console.warn('⚠️ Failed to add security headers:', error);
        }
        // Don't cache sensitive requests
        config.cacheKey = null;
      }

      // Add cache control for non-sensitive GET requests only
      if (config.method && config.method.toLowerCase() === 'get' && config.cacheKey && !isSensitive) {
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
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      return config; // Return original config if interceptor fails
    }
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
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
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/login', credentials),
        {
          loadingMessage: 'Signing you in...',
          successMessage: 'Login successful! Welcome back.',
          errorMessage: 'Login failed. Please check your credentials.'
        }
      );
    },

    register: async (userData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/register', userData),
        {
          loadingMessage: 'Creating your account...',
          successMessage: 'Registration successful! Please verify your email.',
          errorMessage: 'Registration failed. Please try again.'
        }
      );
    },

    verifyOTP: async (otpData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/verify-otp', otpData),
        {
          loadingMessage: 'Verifying OTP...',
          successMessage: 'Email verified successfully!',
          errorMessage: 'OTP verification failed. Please try again.'
        }
      );
    },

    verifyLoginOTP: async (otpData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/verify-login-otp', otpData, { cacheKey: null }),
        {
          loadingMessage: 'Verifying login OTP...',
          successMessage: 'Login OTP verified successfully!',
          errorMessage: 'Login OTP verification failed. Please try again.'
        }
      );
    },

    // --- Password Reset (Forgot Password) ---
    requestPasswordReset: async (data) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/request-password-reset', data, { cacheKey: null }),
        {
          loadingMessage: 'Sending password reset email...',
          successMessage: 'Password reset email sent successfully!',
          errorMessage: 'Failed to send password reset email.'
        }
      );
    },
    verifyPasswordResetOtp: async (data) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/verify-reset-otp', data, { cacheKey: null }),
        {
          loadingMessage: 'Verifying OTP...',
          successMessage: 'OTP verified successfully!',
          errorMessage: 'Failed to verify OTP.'
        }
      );
    },
    resetPassword: async (data) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/reset-password', data, { cacheKey: null }),
        {
          loadingMessage: 'Resetting password...',
          successMessage: 'Password reset successfully!',
          errorMessage: 'Failed to reset password.'
        }
      );
    },

    // --- Password Change (Authenticated User) ---
    sendPasswordOTP: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/send-password-otp', {}, { cacheKey: null }),
        {
          loadingMessage: 'Sending OTP...',
          successMessage: 'OTP sent successfully!',
          errorMessage: 'Failed to send OTP.'
        }
      );
    },

    verifyPasswordOTP: async (otp) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/verify-password-otp', { otp }, { cacheKey: null }),
        {
          loadingMessage: 'Verifying OTP...',
          successMessage: 'OTP verified successfully!',
          errorMessage: 'Failed to verify OTP.'
        }
      );
    },

    changePassword: async (data) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.put('/auth/change-password', data, { cacheKey: null }),
        {
          loadingMessage: 'Changing password...',
          successMessage: 'Password changed successfully!',
          errorMessage: 'Failed to change password.'
        }
      );
    },

    getProfile: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/auth/profile', {
          cacheKey: 'user_profile',
          cacheTtl: 300000 // 5 minutes
        }),
        {
          loadingMessage: 'Loading profile...',
          successMessage: 'Profile loaded successfully',
          errorMessage: 'Failed to fetch profile',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    logout: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/logout'),
        {
          loadingMessage: 'Logging out...',
          successMessage: 'Logged out successfully',
          errorMessage: 'Logout failed',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    refreshToken: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/refresh'),
        {
          loadingMessage: 'Refreshing token...',
          successMessage: 'Token refreshed successfully',
          errorMessage: 'Token refresh failed',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    getTier: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/auth/tier', {
          cacheKey: 'user_tier',
          cacheTtl: 600000 // 10 minutes
        }),
        {
          loadingMessage: 'Loading tier information...',
          successMessage: 'Tier information loaded successfully',
          errorMessage: 'Failed to fetch tier',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    getTierLimits: async (tierLevel) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/auth/tier-limits/${tierLevel}`, {
          cacheKey: `tier_limits_${tierLevel}`,
          cacheTtl: 3600000 // 1 hour
        }),
        {
          loadingMessage: 'Loading tier limits...',
          successMessage: 'Tier limits loaded successfully',
          errorMessage: 'Failed to fetch tier limits',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    upgradeTier: async (tierData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/auth/upgrade-tier', tierData),
        {
          loadingMessage: 'Upgrading tier...',
          successMessage: 'Tier upgraded successfully!',
          errorMessage: 'Failed to upgrade tier'
        }
      );
    },

    getDevices: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/auth/devices', {
          cacheKey: 'user_devices',
          cacheTtl: 300000 // 5 minutes
        }),
        {
          loadingMessage: 'Loading devices...',
          successMessage: 'Devices loaded successfully',
          errorMessage: 'Failed to fetch devices',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    updateProfile: async (profileData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.put('/auth/profile', profileData),
        {
          loadingMessage: 'Updating profile...',
          successMessage: 'Profile updated successfully!',
          errorMessage: 'Failed to update profile'
        }
      );
    },

    updateSettings: async (settingsData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.put('/auth/settings', settingsData),
        {
          loadingMessage: 'Updating settings...',
          successMessage: 'Settings updated successfully!',
          errorMessage: 'Failed to update settings'
        }
      );
    }
  },

  // Public voucher endpoints (no auth)
  publicVouchers: {
    searchByCode: async (voucherCode) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/public-vouchers/${voucherCode}`),
        {
          loadingMessage: 'Searching for voucher...',
          successMessage: 'Voucher found successfully',
          errorMessage: 'Failed to search for voucher',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    }
  },

  // Voucher endpoints
  vouchers: {
    // Get all vouchers
    getAll: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/vouchers', {
          cacheKey: 'vouchers_list',
          cacheTtl: 120000 // 2 minutes
        }),
        {
          loadingMessage: 'Loading vouchers...',
          successMessage: 'Vouchers loaded successfully',
          errorMessage: 'Failed to load vouchers',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    // Get all transactions (voucher creations and redemptions)
    getTransactions: async (page = 1) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/vouchers/transactions`, {
          cacheKey: `vouchers_transactions_${page}`,
          cacheTtl: 60000 // 1 minute
        }),
        {
          loadingMessage: 'Loading voucher transactions...',
          successMessage: 'Voucher transactions loaded successfully',
          errorMessage: 'Failed to load voucher transactions',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    getById: async (id) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/vouchers/${id}`, {
          cacheKey: `voucher_${id}`,
          cacheTtl: 300000 // 5 minutes
        }),
        {
          loadingMessage: 'Loading voucher...',
          successMessage: 'Voucher loaded successfully',
          errorMessage: 'Failed to fetch voucher',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    create: async (voucherData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers', voucherData),
        {
          loadingMessage: 'Creating voucher...',
          successMessage: 'Voucher created successfully!',
          errorMessage: 'Failed to create voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    createWorkOrder: async (voucherData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/work-order', voucherData),
        {
          loadingMessage: 'Creating work order voucher...',
          successMessage: 'Work order voucher created successfully!',
          errorMessage: 'Failed to create work order voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    createPurchaseEscrow: async (voucherData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/purchase-escrow', voucherData),
        {
          loadingMessage: 'Creating purchase escrow voucher...',
          successMessage: 'Purchase escrow voucher created successfully!',
          errorMessage: 'Failed to create purchase escrow voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    createPrepaid: async (voucherData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/prepaid', voucherData),
        {
          loadingMessage: 'Creating prepaid voucher...',
          successMessage: 'Prepaid voucher created successfully!',
          errorMessage: 'Failed to create prepaid voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    createGiftCard: async (voucherData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/gift-card', voucherData),
        {
          loadingMessage: 'Creating gift card voucher...',
          successMessage: 'Gift card voucher created successfully!',
          errorMessage: 'Failed to create gift card voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    redeem: async (redeemData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/redeem', redeemData),
        {
          loadingMessage: 'Redeeming voucher...',
          successMessage: 'Voucher redeemed successfully!',
          errorMessage: 'Failed to redeem voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    redeemVoucher: async (redeemData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/redeem', redeemData),
        {
          loadingMessage: 'Redeeming voucher...',
          successMessage: 'Voucher redeemed successfully!',
          errorMessage: 'Failed to redeem voucher.'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    confirmCancel: async (voucherId) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post(`/vouchers/${voucherId}/confirm-cancel`),
        {
          loadingMessage: 'Confirming cancellation...',
          successMessage: 'Voucher cancellation confirmed successfully!',
          errorMessage: 'Failed to confirm cancellation'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    requestRedemptionOTP: async (voucherCode) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/request-redemption-otp', { voucherCode }),
        {
          loadingMessage: 'Requesting redemption OTP...',
          successMessage: 'Redemption OTP sent successfully!',
          errorMessage: 'Failed to request redemption OTP'
        }
      );
    },

    verifyRedemptionOTP: async (voucherCode, otp) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/verify-redemption-otp', { voucherCode, otp }),
        {
          loadingMessage: 'Verifying redemption OTP...',
          successMessage: 'Redemption OTP verified successfully!',
          errorMessage: 'Failed to verify redemption OTP'
        }
      );
    },

    cancel: async (cancelData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/cancel', cancelData),
        {
          loadingMessage: 'Cancelling voucher...',
          successMessage: 'Voucher cancelled successfully!',
          errorMessage: 'Failed to cancel voucher'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    activate: async (activateData) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/activate', activateData),
        {
          loadingMessage: 'Activating voucher...',
          successMessage: 'Voucher activated successfully!',
          errorMessage: 'Failed to activate voucher'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    activateVoucher: async (voucherId) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/activate', { voucherId }),
        {
          loadingMessage: 'Activating voucher...',
          successMessage: 'Voucher activated successfully!',
          errorMessage: 'Failed to activate voucher'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    cancelVoucher: async (voucherId, reason) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/cancel', { voucherId, reason }),
        {
          loadingMessage: 'Cancelling voucher...',
          successMessage: 'Voucher cancelled successfully!',
          errorMessage: 'Failed to cancel voucher'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    releaseMilestone: async (voucherId) => {
      const result = await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/release-milestone', { voucherId }),
        {
          loadingMessage: 'Releasing milestone...',
          successMessage: 'Milestone released successfully!',
          errorMessage: 'Failed to release milestone'
        }
      );
      if (result.success) {
        apiService.clearCache();
      }
      return result;
    },

    getBalance: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/vouchers/balance', {
          cacheKey: 'user_balance',
          cacheTtl: 60000 // 1 minute
        }),
        {
          loadingMessage: 'Loading balance...',
          successMessage: 'Balance loaded successfully',
          errorMessage: 'Failed to fetch balance',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    searchByCode: async (voucherCode) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/vouchers/search/${voucherCode}`, {
          cacheKey: `voucher_search_${voucherCode}`,
          cacheTtl: 300000 // 5 minutes
        }),
        {
          loadingMessage: 'Searching for voucher...',
          successMessage: 'Voucher found successfully',
          errorMessage: 'Failed to search voucher',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    uploadVoucher: async (formData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/vouchers/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }),
        {
          loadingMessage: 'Uploading voucher...',
          successMessage: 'Voucher uploaded successfully!',
          errorMessage: 'Failed to upload voucher'
        }
      );
    }
  },

  // Theme endpoints
  themes: {
    getByVoucherType: async (voucherType) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/themes/${voucherType}`, {
          cacheKey: `themes_${voucherType}`,
          cacheTtl: 300000 // 5 minutes
        }),
        {
          loadingMessage: `Loading themes for ${voucherType}...`,
          successMessage: `Themes loaded successfully`,
          errorMessage: `Failed to load themes for ${voucherType}`,
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    }
  },

  // Transaction endpoints
  transactions: {
    getAll: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/transactions', {
          cacheKey: 'transactions_list',
          cacheTtl: 120000 // 2 minutes
        }),
        {
          loadingMessage: 'Loading transactions...',
          successMessage: 'Transactions loaded successfully',
          errorMessage: 'Failed to load transactions',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    }
  },

  // Payment endpoints
  payments: {
    // Initialize wallet funding
    fundWallet: async (paymentData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/payments/fund-wallet', paymentData),
        {
          loadingMessage: 'Initializing wallet funding...',
          successMessage: 'Wallet funding initiated successfully!',
          errorMessage: 'Failed to initialize wallet funding.'
        }
      );
    },

    // Get wallet balance
    getWalletBalance: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/payments/wallet-balance', {
          cacheKey: 'wallet_balance',
          cacheTtl: 60000 // 1 minute
        }),
        {
          loadingMessage: 'Loading wallet balance...',
          successMessage: 'Wallet balance loaded successfully.',
          errorMessage: 'Failed to fetch wallet balance.',
          showSuccessToast: false // Don't show success toast for GET requests
        }
      );
    },

    // Get wallet transactions
    getWalletTransactions: async (page = 1, limit = 10) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/payments/wallet-transactions?page=${page}&limit=${limit}`, {
          cacheKey: `wallet_transactions_${page}`,
          cacheTtl: 120000 // 2 minutes
        }),
        {
          loadingMessage: 'Loading wallet transactions...',
          successMessage: 'Wallet transactions loaded successfully',
          errorMessage: 'Failed to fetch wallet transactions',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    // Get list of banks
    getBanks: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/payments/banks'),
        {
          loadingMessage: 'Loading banks...',
          successMessage: 'Banks loaded successfully',
          errorMessage: 'Failed to fetch banks',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    },

    // Verify bank account
    verifyBankAccount: async (accountData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/payments/verify-account', accountData),
        {
          loadingMessage: 'Verifying bank account...',
          successMessage: 'Bank account verified successfully!',
          errorMessage: 'Failed to verify bank account'
        }
      );
    },

    // Initiate withdrawal
    withdraw: async (withdrawalData) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.post('/payments/withdraw', withdrawalData),
        {
          loadingMessage: 'Initiating withdrawal...',
          successMessage: 'Withdrawal request submitted successfully!',
          errorMessage: 'Failed to initiate withdrawal'
        }
      );
    },

    // Get withdrawal transactions
    getWithdrawals: async (page = 1, limit = 10) => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get(`/payments/withdrawals?page=${page}&limit=${limit}`, {
          cacheKey: `withdrawals_${page}`,
          cacheTtl: 120000 // 2 minutes
        }),
        {
          loadingMessage: 'Loading withdrawals...',
          successMessage: 'Withdrawals loaded successfully',
          errorMessage: 'Failed to fetch withdrawals',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    }
  },

  // Rates endpoints
  rates: {
    getUsdToNgnRate: async () => {
      return await apiResponseHandler.handleApiCall(
        () => apiClient.get('/rates/usd-to-ngn'),
        {
          loadingMessage: 'Loading exchange rate...',
          successMessage: 'Exchange rate loaded successfully',
          errorMessage: 'Failed to load exchange rate',
          showSuccessToast: false,
          showErrorToast: true
        }
      );
    }
  }
};

// Referral API methods
export const referralAPI = {
  // Get user's referral statistics
  getStats: async () => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get('/referrals/stats'),
      {
        loadingMessage: 'Loading referral statistics...',
        successMessage: 'Referral statistics loaded successfully',
        errorMessage: 'Failed to load referral statistics',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },
  
  // Validate referral code
  validateCode: async (referralCode) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.post('/referrals/validate', { referralCode }),
      {
        loadingMessage: 'Validating referral code...',
        successMessage: 'Referral code validated successfully',
        errorMessage: 'Failed to validate referral code',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },
  
  // Get referral settings
  getSettings: async () => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get('/referrals/settings'),
      {
        loadingMessage: 'Loading referral settings...',
        successMessage: 'Referral settings loaded successfully',
        errorMessage: 'Failed to load referral settings',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },
  
  // Get user's referral earnings
  getEarnings: async (page = 1, limit = 20) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get(`/referrals/earnings?page=${page}&limit=${limit}`),
      {
        loadingMessage: 'Loading referral earnings...',
        successMessage: 'Referral earnings loaded successfully',
        errorMessage: 'Failed to load referral earnings',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  },
  
  // Get referred users
  getReferredUsers: async (page = 1, limit = 20) => {
    return await apiResponseHandler.handleApiCall(
      () => apiClient.get(`/referrals/referred-users?page=${page}&limit=${limit}`),
      {
        loadingMessage: 'Loading referred users...',
        successMessage: 'Referred users loaded successfully',
        errorMessage: 'Failed to load referred users',
        showSuccessToast: false,
        showErrorToast: true
      }
    );
  }
};

export { apiClient };
export default apiService; 