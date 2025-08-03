import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';
import apiService from '../api';

export const useThemes = (voucherType) => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  const fetchThemes = useCallback(async () => {
    if (!voucherType) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🎨 Fetching themes for ${voucherType}...`);
      const response = await apiService.themes.getByVoucherType(voucherType);
      console.log(`🎨 Themes response for ${voucherType}:`, response);
      
      if (response.success) {
        const themesData = response.data || [];
        setThemes(themesData);
        console.log(`✅ Themes updated for ${voucherType}:`, themesData);
      } else {
        const errorMsg = response.message || 'Failed to fetch themes';
        setError(errorMsg);
        console.error(`❌ Themes fetch failed for ${voucherType}:`, errorMsg);
        dispatch(showToast({
          message: errorMsg,
          type: 'error'
        }));
      }
    } catch (error) {
      const errorMsg = 'Failed to fetch themes. Please try again.';
      setError(errorMsg);
      console.error(`❌ Themes fetch error for ${voucherType}:`, error);
      dispatch(showToast({
        message: errorMsg,
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  }, [voucherType, dispatch]);

  // Fetch themes on mount and when voucherType changes
  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

  // Refresh themes function
  const refreshThemes = useCallback(() => {
    fetchThemes();
  }, [fetchThemes]);

  return {
    themes,
    loading,
    error,
    refreshThemes
  };
}; 