import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';

import authReducer from './slices/authSlice';
import voucherReducer from './slices/voucherSlice';
import uiReducer from './slices/uiSlice';
import toastReducer from './slices/toastSlice';

// Persist configuration for auth data
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'securitySettings', 'loginHistory'], // Only persist essential data
  blacklist: ['isLoading', 'error', 'tempToken'] // Don't persist loading states
};

// Persist configuration for UI preferences
const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'sidebarCollapsed', 'notifications'],
  blacklist: ['isLoading', 'modals']
};

// Enhanced logger for development
const logger = createLogger({
  collapsed: true,
  duration: true,
  timestamp: true,
  colors: {
    title: () => '#139BFE',
    prevState: () => '#9C9C9C',
    action: () => '#149945',
    nextState: () => '#A47104',
    error: () => '#FF0000',
  },
  predicate: () => {
    // Only log in development
    return import.meta.env.DEV;
  }
});

// Custom middleware for performance monitoring
const performanceMiddleware = () => next => action => {
  const startTime = performance.now();
  const result = next(action);
  const endTime = performance.now();
  
  // Log slow actions in development
  if (import.meta.env.DEV && endTime - startTime > 16) {
    console.warn(`Slow action detected: ${action.type} took ${(endTime - startTime).toFixed(2)}ms`);
  }
  
  return result;
};

// Security middleware for sensitive actions
const securityMiddleware = () => next => action => {
  // Log security-sensitive actions
  const securityActions = ['auth/loginUser', 'auth/registerUser', 'auth/logoutUser', 'vouchers/redeemVoucher'];
  if (securityActions.includes(action.type)) {
    console.log(`Security action: ${action.type}`, {
      timestamp: new Date().toISOString(),
      userId: 'tracked',
      ip: action.meta?.arg?.ip || 'unknown'
    });
  }
  
  return next(action);
};

// Cache middleware for API responses
const cacheMiddleware = () => next => action => {
  // Implement response caching for GET requests
  if (action.type.endsWith('/fulfilled') && action.meta?.arg?.cacheKey) {
    const cacheKey = action.meta.arg.cacheKey;
    const cacheData = {
      data: action.payload,
      timestamp: Date.now(),
      ttl: action.meta.arg.ttl || 300000 // 5 minutes default
    };
    
    try {
      sessionStorage.setItem(`cache_${cacheKey}`, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }
  
  return next(action);
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    vouchers: voucherReducer,
    ui: persistReducer(uiPersistConfig, uiReducer),
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        ignoredPaths: ['auth.tempToken', 'vouchers.themesCache']
      },
      immutableCheck: {
        ignoredPaths: ['vouchers.themesCache']
      }
    });
    
    // Add custom middleware
    middleware.push(performanceMiddleware);
    middleware.push(securityMiddleware);
    middleware.push(cacheMiddleware);
    
    // Add logger only in development
    if (import.meta.env.DEV) {
      middleware.push(logger);
    }
    
    return middleware;
  },
  devTools: import.meta.env.DEV,
  preloadedState: {
    // Initialize with data from localStorage for better performance
    auth: {
      token: localStorage.getItem('token'),
      user: JSON.parse(localStorage.getItem('user') || 'null'),
      isAuthenticated: !!localStorage.getItem('token')
    }
  }
});

export const persistor = persistStore(store);

// Enhanced store utilities
export const getCachedData = (cacheKey) => {
  try {
    const cached = sessionStorage.getItem(`cache_${cacheKey}`);
    if (cached) {
      const { data, timestamp, ttl } = JSON.parse(cached);
      if (Date.now() - timestamp < ttl) {
        return data;
      }
      // Remove expired cache
      sessionStorage.removeItem(`cache_${cacheKey}`);
    }
  } catch (error) {
    console.warn('Cache retrieval failed:', error);
  }
  return null;
};

export const clearCache = () => {
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
};

// Type definitions for better development experience (JSDoc for JavaScript)
/**
 * @typedef {import('@reduxjs/toolkit').RootState} RootState
 * @typedef {import('@reduxjs/toolkit').AppDispatch} AppDispatch
 */ 