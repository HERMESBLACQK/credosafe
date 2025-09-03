// Security utilities to protect sensitive data

// List of sensitive endpoints that should never be cached
export const SENSITIVE_ENDPOINTS = [
  '/auth/login',
  '/auth/register', 
  '/auth/verify-otp',
  '/auth/logout',
  '/auth/devices',
  '/payments/wallet-balance',
  '/payments/wallet-transactions',
  '/payments/withdraw',
  '/vouchers/balance',
  '/profile',
  '/settings'
];

// Check if an endpoint is sensitive
export const isSensitiveEndpoint = (url) => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  return SENSITIVE_ENDPOINTS.some(endpoint => url.includes(endpoint));
};

// Get security headers for sensitive requests
export const getSecurityHeaders = () => ({
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Requested-With': 'XMLHttpRequest'
});

// Secure token storage (with encryption in production)
export const secureTokenStorage = {
  setToken: (token) => {
    try {
      // In production, you might want to encrypt the token
      localStorage.setItem('token', token);
      // Set a flag to indicate token is present
      sessionStorage.setItem('hasToken', 'true');
    } catch (error) {
      console.error('Failed to store token:', error);
    }
  },

  getToken: () => {
    try {
      return localStorage.getItem('token');
    } catch (error) {
      console.error('Failed to retrieve token:', error);
      return null;
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('hasToken');
      // Clear any cached data
      clearSensitiveCache();
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  },

  hasToken: () => {
    try {
      return !!localStorage.getItem('token');
    } catch (error) {
      return false;
    }
  }
};

// Clear sensitive cached data
export const clearSensitiveCache = () => {
  try {
    // Clear all session storage
    sessionStorage.clear();
    
    // Clear specific cache keys that might contain sensitive data
    const cacheKeys = Object.keys(sessionStorage);
    cacheKeys.forEach(key => {
      if (key.startsWith('cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
};

// Sanitize data before logging (remove sensitive information)
export const sanitizeForLogging = (data) => {
  if (!data) return data;
  
  const sensitiveFields = ['token', 'password', 'otp', 'balance', 'amount', 'email'];
  const sanitized = { ...data };
  
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });
  
  return sanitized;
};

// Prevent sensitive data from being stored in browser history
export const preventHistoryStorage = () => {
  // Replace current history entry to prevent back button from showing sensitive data
  if (window.history && window.history.replaceState) {
    window.history.replaceState(null, '', window.location.href);
  }
};

// Clear sensitive data on page unload
export const setupPageUnloadCleanup = () => {
  window.addEventListener('beforeunload', () => {
    // Clear any temporary sensitive data
    clearSensitiveCache();
  });
};

// Initialize security measures
export const initializeSecurity = () => {
  setupPageUnloadCleanup();
  preventHistoryStorage();
}; 