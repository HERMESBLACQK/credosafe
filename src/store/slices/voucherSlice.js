import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../api';

// Async thunks for vouchers
export const createVoucher = createAsyncThunk(
  'vouchers/createVoucher',
  async (voucherData, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Date.now().toString(),
            ...voucherData,
            status: 'pending',
            createdAt: new Date().toISOString(),
          });
        }, 1000);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVouchers = createAsyncThunk(
  'vouchers/fetchVouchers',
  async (_, { rejectWithValue }) => {
    try {
      // Check if token exists
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, returning empty array');
        return [];
      }

      // Fetch from backend API using apiService
      const response = await apiService.vouchers.getAll();
      
      console.log('Vouchers fetched successfully:', response);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      
      // If it's a network error (backend not running), return empty array
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('Backend not available, returning empty array');
        return [];
      }
      
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateVoucherStatus = createAsyncThunk(
  'vouchers/updateVoucherStatus',
  async ({ voucherId, status }, { rejectWithValue }) => {
    try {
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: voucherId, status });
        }, 500);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  vouchers: [],
  currentVoucher: null,
  loading: false,
  error: null,
  filters: {
    type: 'all',
    status: 'all',
    dateRange: null,
  },
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
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: 'all',
        status: 'all',
        dateRange: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Create voucher
      .addCase(createVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers.unshift(action.payload);
        state.currentVoucher = action.payload;
      })
      .addCase(createVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch vouchers
      .addCase(fetchVouchers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVouchers.fulfilled, (state, action) => {
        state.loading = false;
        state.vouchers = action.payload;
      })
      .addCase(fetchVouchers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update voucher status
      .addCase(updateVoucherStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVoucherStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.vouchers.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.vouchers[index].status = action.payload.status;
        }
        if (state.currentVoucher?.id === action.payload.id) {
          state.currentVoucher.status = action.payload.status;
        }
      })
      .addCase(updateVoucherStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentVoucher,
  clearCurrentVoucher,
  updateFilters,
  clearFilters,
} = voucherSlice.actions;

export default voucherSlice.reducer; 