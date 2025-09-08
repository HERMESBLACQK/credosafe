import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
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
  Loader,
  Search,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api';
import { showSuccess, showError } from '../utils/toast';
// import { useLoading } from '../contexts/LoadingContext';
import useFeeSettings from '../hooks/useFeeSettings';


const Withdraw = () => {
  const { fees, loading: feeLoading } = useFeeSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [banks, setBanks] = useState([]);
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [userTier, setUserTier] = useState(null);
  const [tierLimits, setTierLimits] = useState(null);
  const [userData, setUserData] = useState(null);
  const [hasRequiredData, setHasRequiredData] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [withdrawFee, setWithdrawFee] = useState(0);
  const [withdrawForm, setWithdrawForm] = useState({
    amount: '',
    accountNumber: '',
    bankCode: '',
    accountName: ''
  });
  
  // Calculate fee and total with fee
  const calculateWithdrawalFee = (amount) => {
    if (!amount || isNaN(amount) || amount <= 0) return 0;
    
    // Default fee structure if fees are not loaded
    if (feeLoading || !fees || !fees.withdrawal) {
      // Flat fee of 10 NGN or 1.5% whichever is higher (as a fallback)
      const flatFee = 10;
      const percentageFee = amount * 0.015;
      return Math.max(flatFee, percentageFee);
    }
    
    // Use the actual fee settings from the API
    const { fixed, percentage } = fees.withdrawal;
    return fixed + (amount * (percentage / 100));
  };
  
  // Calculate fee and total with fee based on current amount
  const amount = parseFloat(withdrawForm.amount) || 0;
  const fee = calculateWithdrawalFee(amount);
  const totalWithFee = amount + fee;



  // Custom dropdown state
  const [isBankDropdownOpen, setIsBankDropdownOpen] = useState(false);
  const [bankSearchTerm, setBankSearchTerm] = useState('');

  // Fetch user data and validate required fields
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.auth.getProfile();
        if (response.success) {
          const userData = response.data.user || response.data;
          setUserData(userData);
          setHasRequiredData(userData.phone && userData.location);
        } else {
          showError(response.error || 'Failed to fetch user data.');
        }
      } catch (error) {
        showError('An error occurred while fetching user data.');
        console.error('Fetch user data error:', error);
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Fetch user tier and limits
  const fetchUserTier = async () => {
    try {
      const response = await apiService.auth.getTier();
      if (response.success) {
        setUserTier(response.data.tier.level);
        try {
          const tierResponse = await apiService.auth.getTierLimits(response.data.tier.level);
          if (tierResponse.success) {
            setTierLimits(tierResponse.data);
          } else {
            setTierLimits({
              daily_withdrawal_limit: 50000,
              monthly_withdrawal_limit: 500000,
              max_voucher_amount: 100000,
              daily_limit: 1000000
            });
          }
        } catch {
          setTierLimits({
            daily_withdrawal_limit: 50000,
            monthly_withdrawal_limit: 500000,
            max_voucher_amount: 100000,
            daily_limit: 1000000
          });
        }
      } else {
        if (response.status === 401 || response.status === 403) {
          alert('Session expired or not authorized. Please log in again.');
          window.location.href = '/signin';
        } else {
          setUserTier(1);
          setTierLimits({
            daily_withdrawal_limit: 50000,
            monthly_withdrawal_limit: 500000,
            max_voucher_amount: 100000,
            daily_limit: 1000000
          });
        }
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        alert('Session expired or not authorized. Please log in again.');
        window.location.href = '/signin';
      } else {
        setUserTier(1);
        setTierLimits({
          daily_withdrawal_limit: 50000,
          monthly_withdrawal_limit: 500000,
          max_voucher_amount: 100000,
          daily_limit: 1000000
        });
      }
    }
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
      showError('Failed to fetch wallet balance');
    }
  };

  // Fetch banks list
  const fetchBanks = async () => {
    try {
      setIsLoadingBanks(true);
      const response = await apiService.payments.getBanks();
      
      if (response.success) {
        setBanks(response.data);
      } else {
        console.error('❌ Banks response not successful:', response);
        showError(response.message || 'Failed to fetch banks');
      }
    } catch (error) {
      console.error('❌ Error fetching banks:', error);
      showError('Failed to fetch banks');
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiService.auth.getProfile();
        if (response.success) {
          const userData = response.data.user || response.data;
          setUserData(userData);
          setHasRequiredData(
            userData?.phone && 
            userData?.location &&
            userData?.wallet
          );
        } else {
          showError(response.error || 'Failed to fetch user data.');
          navigate("/");
        }
      } catch (error) {
        showError('An error occurred while fetching user data.');
        console.error('Fetch user data error:', error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchWalletBalance();
    fetchBanks();
    fetchUserTier();
  }, [dispatch, navigate]);

  // Handle clicking outside dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isBankDropdownOpen && !event.target.closest('.bank-dropdown-container')) {
        setIsBankDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBankDropdownOpen]);

  // Verify bank account
  const verifyAccount = async () => {
    if (!withdrawForm.accountNumber || !withdrawForm.bankCode) {
      showError('Please enter account number and select bank');
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
        showSuccess('Account verified successfully');
      } else {
        showError(response.message);
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      showError('Failed to verify account');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle withdrawal
  const handleWithdraw = async (e) => {
    e.preventDefault();
    
    // Validate user data
    if (!userData || !hasRequiredData) {
      showError('Please complete your profile with phone number and location before withdrawing.');
      return;
    }

    if (!isVerified) {
      showError('Please verify your bank account first.');
      return;
    }

    if (!withdrawForm.amount || parseFloat(withdrawForm.amount) <= 0) {
      showError('Please enter a valid withdrawal amount.');
      return;
    }

    const amount = parseFloat(withdrawForm.amount);
    if (amount > walletBalance) {
      showError('Insufficient balance for withdrawal.');
      return;
    }

    if (tierLimits && amount > tierLimits.daily_withdrawal_limit) {
        showError(`Withdrawal amount exceeds daily limit of ₦${tierLimits.daily_withdrawal_limit.toLocaleString()}.`);
        return;
    }

    try {
      // Optionally show loading toast via helpers if desired
      const response = await apiService.wallet.withdraw({
        amount: amount,
        accountNumber: withdrawForm.accountNumber,
        bankCode: withdrawForm.bankCode,
        accountName: withdrawForm.accountName
      });

      if (response.success) {
        showSuccess('Withdrawal request submitted successfully!');
        
        // Reset form
        setWithdrawForm({
          amount: '',
          accountNumber: '',
          bankCode: '',
          accountName: ''
        });
        setIsVerified(false);
        
        // Refresh balance
        await fetchWalletBalance();
      } else {
        showError(response.message || 'Withdrawal failed.');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      showError('Withdrawal failed. Please try again.');
    } finally {
      // End of withdrawal
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  // Filter banks based on search term
  const filteredBanks = banks.filter(bank =>
    bank.name.toLowerCase().includes(bankSearchTerm.toLowerCase())
  );

  // Handle bank selection
  const handleBankSelect = (bank) => {
    setWithdrawForm(prev => ({ ...prev, bankCode: bank.code }));
    setBankSearchTerm(bank.name);
    setIsBankDropdownOpen(false);
    setIsVerified(false);
  };

  // Handle bank search input change
  const handleBankSearchChange = (e) => {
    const value = e.target.value;
    setBankSearchTerm(value);
    setIsBankDropdownOpen(true);
    if (!value) {
      setWithdrawForm(prev => ({ ...prev, bankCode: '' }));
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
            <motion.button 
              onClick={() => navigate('/dashboard')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Validation Alert */}
      {!loading && userData && !hasRequiredData && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Profile Incomplete:</strong> Please add your phone number and location to your profile before withdrawing funds.
              </p>
              <button
                onClick={() => navigate('/profile')}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Complete Profile
              </button>
            </div>
          </div>
        </div>
      )}

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
               {userTier && tierLimits && (
                 <div className="mt-4 pt-4 border-t border-neutral-200">
                   <p className="text-sm text-neutral-600 mb-1">Your Tier: {userTier}</p>
                   <p className="text-xs text-neutral-500">
                     Daily Limit: {formatCurrency(tierLimits.daily_withdrawal_limit)} | 
                     Monthly Limit: {formatCurrency(tierLimits.monthly_withdrawal_limit)}
                   </p>
                 </div>
               )}
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
                    placeholder="Enter amount to withdraw"
                    min="100"
                    required
                  />
                  <div className="text-xs text-blue-700 mt-1">
                    Fee: ₦{feeLoading ? '...' : fee.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-800 mt-1">
                    Total: ₦{feeLoading ? '...' : totalWithFee.toFixed(2)}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Minimum: ₦100 | Maximum: {formatCurrency(walletBalance)}
                </p>
              </div>

              {/* Bank Selection */}
              <div className="relative bank-dropdown-container">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank
                </label>
                <div className="relative">
                  <Building className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2 z-10" />
                  <input
                    type="text"
                    value={bankSearchTerm}
                    onChange={handleBankSearchChange}
                    onFocus={() => setIsBankDropdownOpen(true)}
                    className="w-full pl-10 pr-10 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Search for a bank..."
                    required
                  />
                  <ChevronDown className="w-5 h-5 text-neutral-400 absolute right-3 top-1/2 transform -translate-y-1/2 z-10" />
                  
                  {/* Custom Dropdown */}
                  {isBankDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
                      {isLoadingBanks ? (
                        <div className="p-4 text-center text-neutral-500">
                          <Loader className="w-5 h-5 animate-spin mx-auto mb-2" />
                          Loading banks...
                        </div>
                      ) : filteredBanks.length === 0 ? (
                        <div className="p-4 text-center text-neutral-500">
                          No banks found
                        </div>
                      ) : (
                        filteredBanks.map((bank) => (
                          <button
                            key={bank.code}
                            type="button"
                            onClick={() => handleBankSelect(bank)}
                            className="w-full px-4 py-3 text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none border-b border-neutral-100 last:border-b-0"
                          >
                            <div className="font-medium text-neutral-900">{bank.name}</div>
                            <div className="text-sm text-neutral-500">Code: {bank.code}</div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
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
                    onBlur={() => {
                      /* fee calc retained in UI above via calculateWithdrawalFee */
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