import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import voucherReducer from './slices/voucherSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    vouchers: voucherReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

// JavaScript version - no TypeScript types 