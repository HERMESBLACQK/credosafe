import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';
import apiService from '../api';

export const useWalletBalance = () => {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching wallet balance...');
      const response = await apiService.payments.getWalletBalance();
      console.log('📡 Balance response:', response);
      
      if (response.success) {
        const newBalance = response.data?.balance || 0;
        setBalance(newBalance);
        console.log('✅ Balance updated:', newBalance);
      } else {
        const errorMsg = response.message || 'Failed to fetch balance';
        setError(errorMsg);
        console.error('❌ Balance fetch failed:', errorMsg);
        dispatch(showToast({
          message: errorMsg,
          type: 'error'
        }));
      }
    } catch (error) {
      const errorMsg = 'Failed to fetch balance. Please try again.';
      setError(errorMsg);
      console.error('❌ Balance fetch error:', error);
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Fetch balance on mount
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Refresh balance function
  const refreshBalance = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    loading,
    error,
    refreshBalance
  };
}; 