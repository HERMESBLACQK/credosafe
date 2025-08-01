import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api/index';

// Async thunks with enhanced caching and error handling
export const fetchVouchers = createAsyncThunk(
  'vouchers/fetchVouchers',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const cached = sessionStorage.getItem('cache_vouchers_list');
      if (cached) {
        const { data, timestamp, ttl } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return { success: true, data: { vouchers: data } };
        }
      }

      const response = await apiService.vouchers.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      // Don't fetch if already loading
      const { vouchers } = getState();
      if (vouchers.isLoading) {
        return false;
      }
    }
  }
);

export const fetchVoucherById = createAsyncThunk(
  'vouchers/fetchVoucherById',
  async (voucherId, { rejectWithValue }) => {
    try {
      const response = await apiService.vouchers.getById(voucherId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createVoucher = createAsyncThunk(
  'vouchers/createVoucher',
  async (voucherData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.vouchers.create(voucherData);
      
      // Clear cache after successful creation
      apiService.clearCache();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const redeemVoucher = createAsyncThunk(
  'vouchers/redeemVoucher',
  async (redeemData, { rejectWithValue, dispatch }) => {
    try {
      const response = await apiService.vouchers.reedeem(redeemData);
      
      // Clear cache after successful redemption
      apiService.clearCache();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cancelVoucher = createAsyncThunk(
  'vouchers/cancelVoucher',
  async (cancelData, { rejectWithValue }) => {
    try {
      const response = await apiService.vouchers.cancel(cancelData);
      
      // Clear cache after successful cancellation
      apiService.clearCache();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const activateVoucher = createAsyncThunk(
  'vouchers/activateVoucher',
  async (activateData, { rejectWithValue }) => {
    try {
      const response = await apiService.vouchers.activate(activateData);
      
      // Clear cache after successful activation
      apiService.clearCache();
      
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchThemes = createAsyncThunk(
  'vouchers/fetchThemes',
  async (voucherType, { rejectWithValue, getState }) => {
    try {
      // Check cache first
      const cacheKey = `themes_${voucherType}`;
      const cached = sessionStorage.getItem(`cache_${cacheKey}`);
      if (cached) {
        const { data, timestamp, ttl } = JSON.parse(cached);
        if (Date.now() - timestamp < ttl) {
          return { success: true, data };
        }
      }

      const response = await apiService.themes.getByVoucherType(voucherType);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchBalance = createAsyncThunk(
  'vouchers/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.vouchers.getBalance();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  vouchers: [],
  currentVoucher: null,
  themes: {},
  balance: 0,
  isLoading: false,
  error: null,
  lastFetched: null,
  themesCache: {},
  filters: {
    type: 'all',
    status: 'all',
    dateRange: 'all'
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

const voucherSlice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentVoucher: (state, action) => {
      state.currentVoucher = action.payload;
    },
    clearCurrentVoucher: (state) => {
      state.currentVoucher = null;
    },
    updateVoucher: (state, action) => {
      const { id, updates } = action.payload;
      const voucherIndex = state.vouchers.findIndex(v => v.id === id);
      if (voucherIndex !== -1) {
        state.vouchers[voucherIndex] = { ...state.vouchers[voucherIndex], ...updates };
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    clearCache: (state) => {
      state.themesCache = {};
      apiService.clearCache();
    },
    addVoucher: (state, action) => {
      state.vouchers.unshift(action.payload);
    },
    removeVoucher: (state, action) => {
      state.vouchers = state.vouchers.filter(v => v.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch vouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        {
          state.isLoading = false;
          if (action.payload.success) {
            // Handle nested data structure: payload.data.vouchers.data
            const vouchersData = action.payload.data?.vouchers?.data || action.payload.data?.vouchers || [];
            state.vouchers = vouchersData;
            state.lastFetched = Date.now();
          } else {
            state.error = action.payload.message || 'Failed to fetch vouchers';
          }
        }
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch vouchers';
      })

      // Fetch voucher by ID
      .addCase(fetchVoucherById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVoucherById.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.currentVoucher = action.payload.data;
        } else {
          state.error = action.payload.message || 'Failed to fetch voucher';
        }
      })
      .addCase(fetchVoucherById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch voucher';
      })

      // Create voucher
      .addCase(createVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Add new voucher to the list
          state.vouchers.unshift(action.payload.data);
        } else {
          state.error = action.payload.message || 'Failed to create voucher';
        }
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to create voucher';
      })

      // Redeem voucher
      .addCase(redeemVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(redeemVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Update voucher status
          const voucherIndex = state.vouchers.findIndex(v => v.id === action.payload.data.id);
          if (voucherIndex !== -1) {
            state.vouchers[voucherIndex] = { ...state.vouchers[voucherIndex], ...action.payload.data };
          }
        } else {
          state.error = action.payload.message || 'Failed to redeem voucher';
        }
      })
      .addCase(redeemVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to redeem voucher';
      })

      // Cancel voucher
      .addCase(cancelVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Update voucher status
          const voucherIndex = state.vouchers.findIndex(v => v.id === action.payload.data.id);
          if (voucherIndex !== -1) {
            state.vouchers[voucherIndex] = { ...state.vouchers[voucherIndex], ...action.payload.data };
          }
        } else {
          state.error = action.payload.message || 'Failed to cancel voucher';
        }
      })
      .addCase(cancelVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to cancel voucher';
      })

      // Activate voucher
      .addCase(activateVoucher.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(activateVoucher.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Update voucher status
          const voucherIndex = state.vouchers.findIndex(v => v.id === action.payload.data.id);
          if (voucherIndex !== -1) {
            state.vouchers[voucherIndex] = { ...state.vouchers[voucherIndex], ...action.payload.data };
          }
        } else {
          state.error = action.payload.message || 'Failed to activate voucher';
        }
      })
      .addCase(activateVoucher.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to activate voucher';
      })

      // Fetch themes
      .addCase(fetchThemes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchThemes.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          // Store themes in cache
          const voucherType = action.meta.arg;
          state.themesCache[voucherType] = {
            data: action.payload.data,
            timestamp: Date.now()
          };
        } else {
          state.error = action.payload.message || 'Failed to fetch themes';
        }
      })
      .addCase(fetchThemes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch themes';
      })

      // Fetch balance
      .addCase(fetchBalance.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.balance = action.payload.data?.balance || 0;
        } else {
          state.error = action.payload.message || 'Failed to fetch balance';
        }
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch balance';
      });
  }
});

// Export actions
export const {
  clearError,
  setCurrentVoucher,
  clearCurrentVoucher,
  updateVoucher,
  setFilters,
  setPagination,
  clearCache,
  addVoucher,
  removeVoucher
} = voucherSlice.actions;

// Export selectors
export const selectVouchers = (state) => state.vouchers.vouchers;
export const selectCurrentVoucher = (state) => state.vouchers.currentVoucher;
export const selectThemes = (state) => state.vouchers.themesCache;
export const selectBalance = (state) => state.vouchers.balance;
export const selectIsLoading = (state) => state.vouchers.isLoading;
export const selectError = (state) => state.vouchers.error;
export const selectFilters = (state) => state.vouchers.filters;
export const selectPagination = (state) => state.vouchers.pagination;

// Enhanced selectors with filtering
export const selectFilteredVouchers = (state) => {
  const { vouchers, filters } = state.vouchers;
  let filtered = vouchers;

  // Filter by type
  if (filters.type !== 'all') {
    filtered = filtered.filter(v => v.type === filters.type);
  }

  // Filter by status
  if (filters.status !== 'all') {
    filtered = filtered.filter(v => v.status === filters.status);
  }

  // Filter by date range
  if (filters.dateRange !== 'all') {
    const now = new Date();
    const voucherDate = new Date();
    
    switch (filters.dateRange) {
      case 'today':
        filtered = filtered.filter(v => {
          voucherDate.setTime(v.created_at);
          return voucherDate.toDateString() === now.toDateString();
        });
        break;
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(v => {
          voucherDate.setTime(v.created_at);
          return voucherDate >= weekAgo;
        });
        break;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(v => {
          voucherDate.setTime(v.created_at);
          return voucherDate >= monthAgo;
        });
        break;
    }
  }

  return filtered;
};

export const selectVoucherById = (state, voucherId) => {
  return state.vouchers.vouchers.find(v => v.id === voucherId);
};

export const selectThemeByVoucherType = (state, voucherType) => {
  return state.vouchers.themesCache[voucherType]?.data || null;
};

export default voucherSlice.reducer; 