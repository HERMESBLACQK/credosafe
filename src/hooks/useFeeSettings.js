// useFeeSettings.js
import { useState, useEffect } from 'react';
import { apiClient } from '../api/index';

/**
 * React hook to fetch and provide fee settings from the backend.
 * Usage: const { fees, loading, error, getFeeForType, calculateFee } = useFeeSettings();
 */
export default function useFeeSettings() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/fees-settings');
        if (response.data.success) {
          setFees(response.data.data || []);
          setError(null);
        } else {
          setError(response.data.message || 'Failed to fetch fees');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch fees');
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  // Get fee object for a given fee_type
  function getFeeForType(feeType) {
    return fees.find(fee => fee.fee_type === feeType);
  }

  // Calculate fee for an amount, given fee_type
  function calculateFee(feeType, amount) {
    const fee = getFeeForType(feeType);
    if (!fee) return 0;
    const minFee = parseFloat(fee.fee_amount);
    const percent = parseFloat(fee.fee_percentage || 0);
    const percentFee = percent > 0 ? (percent * amount) / 100 : 0;
    return Math.round(Math.max(minFee, percentFee) * 100) / 100;
  }

  return { fees, loading, error, getFeeForType, calculateFee };
}
