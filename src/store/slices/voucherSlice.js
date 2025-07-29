import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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
      // Simulate API call
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              type: 'work-order',
              title: 'Website Development',
              amount: 5000,
              status: 'active',
              createdAt: '2024-01-15T10:00:00Z',
            },
            {
              id: '2',
              type: 'purchase-escrow',
              title: 'Laptop Purchase',
              amount: 1200,
              status: 'completed',
              createdAt: '2024-01-10T14:30:00Z',
            },
          ]);
        }, 800);
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
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