import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api';

// Async thunks with better error handling and caching
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.login(credentials);
      if (response.success) {
        // Store token securely
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Set token in API service for future requests
        apiService.setAuthToken(response.data.token);
        
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Login failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  },
  {
    // Cache successful logins for 5 minutes
    condition: (_, { getState }) => {
      const { auth } = getState();
      return !auth.isLoading && !auth.user;
    }
  }
);

// Action to store login data after successful login
export const storeLoginData = createAsyncThunk(
  'auth/storeLoginData',
  async (loginData, { rejectWithValue }) => {
    try {
      const { user, token } = loginData;
      
      // Store token securely
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set token in API service for future requests
      apiService.setAuthToken(token);
      
      return { user, token };
    } catch (error) {
      return rejectWithValue('Failed to store login data');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.register(userData);
      if (response.success) {
        // Store temporary token for email verification
        localStorage.setItem('tempToken', response.data.token);
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.verifyOTP(otpData);
      if (response.success) {
        // Replace temp token with permanent token
        localStorage.removeItem('tempToken');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        apiService.setAuthToken(response.data.token);
        return response.data;
      } else {
        return rejectWithValue(response.message || 'OTP verification failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      // Skip if we already have user data and it's recent (within 5 minutes)
      if (auth.user && auth.lastFetched && Date.now() - auth.lastFetched < 300000) {
        return auth.user;
      }
      
      const response = await apiService.auth.getProfile();
      if (response.success) {
        return response.data.user; // Return the user object, not the entire data object
      } else {
        return rejectWithValue(response.message || 'Failed to fetch profile');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  },
  {
    // Prevent multiple simultaneous requests
    condition: (_, { getState }) => {
      const { auth } = getState();
      return !auth.isLoading;
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Call logout endpoint to invalidate token on server
      await apiService.auth.logout();
      
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('user');
      
      // Clear API service token
      apiService.setAuthToken(null);
      
      return true;
    } catch (error) {
      // Even if server logout fails, clear local data
      localStorage.removeItem('token');
      localStorage.removeItem('tempToken');
      localStorage.removeItem('user');
      apiService.setAuthToken(null);
      
      return rejectWithValue('Logout completed locally');
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.auth.refreshToken();
      if (response.success) {
        localStorage.setItem('token', response.data.token);
        apiService.setAuthToken(response.data.token);
        return response.data;
      } else {
        return rejectWithValue(response.message || 'Token refresh failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Network error');
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  tempToken: localStorage.getItem('tempToken'),
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,
  lastFetched: null,
  deviceInfo: null,
  loginHistory: [],
  securitySettings: {
    twoFactorEnabled: false,
    lastPasswordChange: null,
    loginNotifications: true
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setDeviceInfo: (state, action) => {
      state.deviceInfo = action.payload;
    },
    updateSecuritySettings: (state, action) => {
      state.securitySettings = { ...state.securitySettings, ...action.payload };
    },
    addLoginHistory: (state, action) => {
      state.loginHistory.unshift(action.payload);
      // Keep only last 10 logins
      if (state.loginHistory.length > 10) {
        state.loginHistory = state.loginHistory.slice(0, 10);
      }
    },
    // Optimistic updates for better UX
    updateUserProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Store Login Data
      .addCase(storeLoginData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(storeLoginData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(storeLoginData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tempToken = action.payload.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // OTP Verification
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.tempToken = null;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.tempToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
        state.lastFetched = null;
        state.deviceInfo = null;
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.lastFetched = Date.now();
      })
      .addCase(refreshToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.user = null;
        state.token = null;
        state.tempToken = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = 'Session expired';
        state.lastFetched = null;
        state.deviceInfo = null;
      });
  }
});

export const { 
  clearError, 
  setDeviceInfo, 
  updateSecuritySettings, 
  addLoginHistory,
  updateUserProfile 
} = authSlice.actions;

// Alias for backward compatibility
export const updateUser = updateUserProfile;

// Selectors for optimized performance
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;
export const selectUserBalance = (state) => state.auth.user?.wallet_balance || 0;
export const selectUserTier = (state) => state.auth.user?.tier || 1;
export const selectDeviceInfo = (state) => state.auth.deviceInfo;
export const selectLoginHistory = (state) => state.auth.loginHistory;
export const selectSecuritySettings = (state) => state.auth.securitySettings;

export default authSlice.reducer; 