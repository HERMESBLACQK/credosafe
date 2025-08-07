import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Shield, 
  Wallet as WalletIcon, 
  ArrowLeft,
  Plus,
  Minus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  X,
  CheckCircle,
  Clock,
  Calendar,
  ArrowRight,
  CreditCard,
  Building,
  Phone
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api';
import { showToast } from '../store/slices/toastSlice';
import { useError } from '../contexts/ErrorContext';
import { useLoading } from '../contexts/LoadingContext';
import useFeeSettings from '../hooks/useFeeSettings';

const Wallet = () => {
  const { fees, loading: feeLoading, error: feeError, calculateFee } = useFeeSettings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { startGlobalLoading, stopGlobalLoading } = useLoading();
  
  const [showBalance, setShowBalance] = useState(true);
  const [showFundModal, setShowFundModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');

  // Fee calculation for funding
  const fundValue = parseFloat(fundAmount) || 0;
  const fundFee = calculateFee('credit_fee', fundValue);
  const fundTotal = fundValue + fundFee;
  const [phone, setPhone] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [usdToNgnRate, setUsdToNgnRate] = useState(null);
  const [isLoadingRate, setIsLoadingRate] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      setIsLoadingBalance(true);
      const response = await apiService.payments.getWalletBalance();
      if (response.success) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to fetch wallet balance' }));
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      console.log('🔄 Fetching recent transactions...');
      const response = await apiService.payments.getWalletTransactions(1, 5);
      
      console.log('📋 Recent transactions response:', {
        success: response.success,
        data: response.data,
        transactions: response.data?.transactions,
        pagination: response.data?.pagination
      });
      
      if (response.success) {
        console.log(`✅ Successfully loaded ${response.data?.transactions?.length || 0} recent transactions`);
        setRecentTransactions(response.data.transactions || []);
      } else {
        console.warn('⚠️ Failed to fetch transactions:', response.message);
        dispatch(showToast({ 
          type: 'error', 
          message: response.message || 'Failed to fetch transactions' 
        }));
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      dispatch(showToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to fetch transactions' 
      }));
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Fetch USD/NGN rate
  const fetchUsdToNgnRate = async () => {
    try {
      setIsLoadingRate(true);
      // Use apiService if available, else use fetch with API_BASE_URL
      let data;
      try {
        // Try using axios via apiService if available
        if (apiService.rates && apiService.rates.getUsdToNgnRate) {
          data = await apiService.rates.getUsdToNgnRate();
        } else {
          // fallback to fetch
          const response = await fetch('/api/rates/usd-to-ngn');
          data = await response.json();
        }
      } catch (err) {
        // fallback to fetch if axios fails
        const response = await fetch('/api/rates/usd-to-ngn');
        data = await response.json();
      }
      console.log('USD/NGN rate server response:', data);
      if (data && data.success) {
        setUsdToNgnRate(data.rate);
      } else {
        setUsdToNgnRate(null);
      }
    } catch (error) {
      // If the response is not JSON, handle gracefully
      setUsdToNgnRate(null);
      try {
        const text = await error.response?.text?.();
        if (text && text.startsWith('<!DOCTYPE')) {
          console.error('Error fetching USD/NGN rate: Received HTML instead of JSON');
        } else {
          console.error('Error fetching USD/NGN rate:', error);
        }
      } catch (e) {
        console.error('Error fetching USD/NGN rate:', error);
      }
    } finally {
      setIsLoadingRate(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchWalletBalance();
    fetchRecentTransactions();
  }, []);

  // Check for payment status from URL params
  useEffect(() => {
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const message = searchParams.get('message');

    if (status === 'success') {
      dispatch(showToast({ 
        type: 'success', 
        message: `Payment successful! Your wallet has been credited with ₦${amount}` 
      }));
      // Refresh balance and transactions
      fetchWalletBalance();
      fetchRecentTransactions();
    } else if (status === 'error') {
      dispatch(showToast({ 
        type: 'error', 
        message: message || 'Payment failed. Please try again.' 
      }));
    }
  }, [searchParams, dispatch]);

  // Fetch rate when modal opens or currency changes
  useEffect(() => {
    if (showFundModal && currency === 'USD') {
      fetchUsdToNgnRate();
    }
  }, [showFundModal, currency]);

  const banks = [
    'Access Bank',
    'First Bank',
    'GT Bank',
    'Zenith Bank',
    'UBA',
    'Stanbic IBTC',
    'Fidelity Bank',
    'Union Bank',
    'Wema Bank',
    'Ecobank'
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'funding' ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeColor = (type) => {
    return type === 'funding' ? 'text-green-600' : 'text-red-600';
  };

  const handleFundSubmit = async (e) => {
    e.preventDefault();
    if (!fundAmount || parseFloat(fundAmount) < 1) {
      dispatch(showToast({ type: 'error', message: `Amount must be at least ${currency === 'NGN' ? '₦100' : '$1'}` }));
      return;
    }
    if (!phone) {
      dispatch(showToast({ type: 'error', message: 'Please enter your phone number' }));
      return;
    }

    try {
      startGlobalLoading();
      const response = await apiService.payments.fundWallet({
        amount: parseFloat(fundAmount),
        phone: phone,
        currency: currency
      });

      if (response.success) {
        window.location.href = response.data.checkoutUrl;
      } else {
        dispatch(showToast({ type: 'error', message: response.message }));
      }
    } catch (error) {
      console.error('Error funding wallet:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to initialize payment' }));
    } finally {
      stopGlobalLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </motion.div>
        
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Wallet</h1>
            <p className="text-neutral-600">Manage your funds and transactions</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-neutral-900">Current Balance</h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm">{showBalance ? 'Hide' : 'Show'} Balance</span>
              </button>
            </div>
            <div className="text-center mb-6">
              <p className="text-4xl font-bold text-primary-600 mb-2">
                {showBalance ? formatCurrency(walletBalance) : '••••••'}
              </p>
              <p className="text-sm text-neutral-600">Available for transactions</p>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowFundModal(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
                <span>Fund Wallet</span>
              </button>
              <button
                onClick={() => navigate('/withdraw')}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Minus className="w-5 h-5" />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-neutral-900">Recent Transactions</h2>
              <button
                onClick={() => navigate('/wallet-transactions')}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="divide-y divide-neutral-200">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {transaction.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.date)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(transaction.date)}</span>
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            Ref: {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'funding' ? '+' : ''}{formatCurrency(transaction.amount)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <CreditCard className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No transactions yet</h3>
                  <p className="text-neutral-600">Start by funding your wallet or making transactions</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-large max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Fund Wallet</h2>
              <button
                onClick={() => setShowFundModal(false)}
                className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleFundSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Amount ({currency === 'NGN' ? '₦' : '$'})
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={e => setFundAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    min={currency === 'NGN' ? 100 : 1}
                    step="0.01"
                    required
                  />
                  <div className="text-xs text-blue-700 mt-1">
                    Fee: ₦{feeLoading ? '...' : fundFee.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-800 mt-1">
                    Total: ₦{feeLoading ? '...' : fundTotal.toFixed(2)}
                  </div>
                </div>
              </div>
              {currency === 'USD' && (
                <div className="text-sm text-neutral-600">
                  {isLoadingRate && <span>Fetching rate...</span>}
                  {!isLoadingRate && usdToNgnRate && (
                    <>
                      ≈ ₦{(parseFloat(fundAmount || 0) * usdToNgnRate).toLocaleString(undefined, { maximumFractionDigits: 2 })} (Rate: ₦{usdToNgnRate} per $1)
                    </>
                  )}
                  {!isLoadingRate && usdToNgnRate === null && (
                    <span className="text-red-500">Unable to fetch USD/NGN rate. Please try again later.</span>
                  )}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="08012345678"
                    required
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowFundModal(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Proceed
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}


      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Wallet; 