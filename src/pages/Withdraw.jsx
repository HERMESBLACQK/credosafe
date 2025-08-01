import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Shield, 
  ArrowLeft,
  DollarSign,
  Building,
  CreditCard,
  CheckCircle,
  X,
  Loader
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api';
import { showToast } from '../store/slices/toastSlice';
import { useLoading } from '../contexts/LoadingContext';

const Withdraw = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { startGlobalLoading, stopGlobalLoading } = useLoading();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [banks, setBanks] = useState([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    accountNumber: '',
    bankCode: '',
    accountName: ''
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Fetch wallet balance
  const fetchWalletBalance = async () => {
    try {
      const response = await apiService.payments.getWalletBalance();
      if (response.success) {
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to fetch wallet balance' }));
    }
  };

  // Fetch banks list
  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await apiService.payments.getBanks();
      if (response.success) {
        setBanks(response.data);
      }
    } catch (error) {
      console.error('Error fetching banks:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to fetch banks' }));
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchWalletBalance();
    fetchBanks();
  }, []);

  // Verify bank account
  const verifyAccount = async () => {
    if (!withdrawForm.accountNumber || !withdrawForm.bankCode) {
      dispatch(showToast({ type: 'error', message: 'Please enter account number and select bank' }));
      return;
    }

    try {
      setIsVerifying(true);
      const response = await apiService.payments.verifyBankAccount({
        accountNumber: withdrawForm.accountNumber,
        bankCode: withdrawForm.bankCode
      });

      if (response.success) {
        setWithdrawForm(prev => ({
          ...prev,
          accountName: response.data.accountName
        }));
        setIsVerified(true);
        dispatch(showToast({ type: 'success', message: 'Account verified successfully' }));
      } else {
        dispatch(showToast({ type: 'error', message: response.message }));
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to verify account' }));
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) < 100) {
      dispatch(showToast({ type: 'error', message: 'Amount must be at least ₦100' }));
      return;
    }

    if (parseFloat(withdrawForm.amount) > walletBalance) {
      dispatch(showToast({ type: 'error', message: 'Insufficient wallet balance' }));
      return;
    }

    if (!isVerified) {
      dispatch(showToast({ type: 'error', message: 'Please verify your account first' }));
      return;
    }

    try {
      startGlobalLoading();
      const response = await apiService.payments.withdraw({
        amount: parseFloat(withdrawForm.amount),
        accountNumber: withdrawForm.accountNumber,
        bankCode: withdrawForm.bankCode,
        accountName: withdrawForm.accountName
      });

      if (response.success) {
        dispatch(showToast({ 
          type: 'success', 
          message: 'Withdrawal initiated successfully. You will receive the funds within 24 hours.' 
        }));
        navigate('/wallet');
      } else {
        dispatch(showToast({ type: 'error', message: response.message }));
      }
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      dispatch(showToast({ type: 'error', message: 'Failed to initiate withdrawal' }));
    } finally {
      stopGlobalLoading();
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
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
            <motion.button 
              onClick={() => navigate('/wallet')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Wallet</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Withdraw Funds</h1>
            <p className="text-neutral-600">Withdraw money from your wallet to your bank account</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-neutral-900 mb-2">Available Balance</h2>
              <p className="text-3xl font-bold text-primary-600 mb-2">
                {formatCurrency(walletBalance)}
              </p>
              <p className="text-sm text-neutral-600">Maximum withdrawal amount</p>
            </div>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <form onSubmit={handleWithdraw} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Amount (₦)
                </label>
                <div className="relative">
                  <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="number"
                    value={withdrawForm.amount}
                    onChange={(e) => setWithdrawForm(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                    min="100"
                    max={walletBalance}
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Minimum: ₦100 | Maximum: {formatCurrency(walletBalance)}
                </p>
              </div>

              {/* Bank Selection */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <select
                    value={withdrawForm.bankCode}
                    onChange={(e) => {
                      setWithdrawForm(prev => ({ ...prev, bankCode: e.target.value }));
                      setIsVerified(false);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.code} value={bank.code}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Number
                </label>
                <div className="relative">
                  <CreditCard className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={withdrawForm.accountNumber}
                    onChange={(e) => {
                      setWithdrawForm(prev => ({ ...prev, accountNumber: e.target.value }));
                      setIsVerified(false);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter 10-digit account number"
                    maxLength="10"
                    required
                  />
                </div>
              </div>

              {/* Verify Account Button */}
              {withdrawForm.accountNumber && withdrawForm.bankCode && (
                <div>
                  <button
                    type="button"
                    onClick={verifyAccount}
                    disabled={isVerifying}
                    className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span>Verify Account</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Account Verification Result */}
              {isVerified && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Account Verified</p>
                      <p className="text-sm text-green-700">{withdrawForm.accountName}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={!isVerified || parseFloat(withdrawForm.amount) > walletBalance || parseFloat(withdrawForm.amount) < 100}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Withdraw Funds
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Withdraw; 