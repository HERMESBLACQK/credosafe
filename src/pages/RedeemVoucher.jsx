import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import apiService from '../api';
import { 
  Shield, 
  ArrowLeft,
  CreditCard,
  CheckCircle,
  X,
  DollarSign,
  Calendar,
  User,
  Building,
  Wallet as WalletIcon,
  Check,
  AlertCircle,
  Download,
  Share2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const RedeemVoucher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [withdrawalMethod, setWithdrawalMethod] = useState('wallet');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [redeemAmount, setRedeemAmount] = useState('');

  // Voucher data from navigation state
  const [voucherData, setVoucherData] = useState(null);
  const [withdrawForm, setWithdrawForm] = useState({
    accountNumber: '',
    bankName: '',
    accountName: ''
  });

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

  useEffect(() => {
    console.log('🔍 RedeemVoucher useEffect triggered');
    console.log('🔍 Location state:', location.state);
    
    if (location.state?.voucherData) {
      console.log('✅ Voucher data received:', location.state.voucherData);
      console.log('🔍 Voucher type:', location.state.voucherData.type);
      console.log('🔍 Milestones:', location.state.voucherData.milestones);
      console.log('🔍 Is milestones array?', Array.isArray(location.state.voucherData.milestones));
      console.log('🔍 Milestones length:', location.state.voucherData.milestones?.length);
      setVoucherData(location.state.voucherData);
      
      // Set initial redeem amount for prepaid vouchers
      if (location.state.voucherData.type === 'prepaid') {
        const availableAmount = location.state.voucherData.available_amount || location.state.voucherData.total_amount;
        setRedeemAmount(availableAmount?.toString() || '');
      }
    } else {
      console.log('❌ No voucher data found, redirecting to redeem page');
      navigate('/redeem');
    }
  }, [location.state, navigate]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if voucher is expired
  const isVoucherExpired = () => {
    if (!voucherData?.due_date) return false; // If no due date, voucher is not expired
    return new Date() > new Date(voucherData.due_date);
  };

  // Check if voucher can be redeemed
  const canRedeemVoucher = () => {
    if (!voucherData) return false;
    
    // Check if voucher is completed
    if (voucherData.status === 'completed') return false;
    
    // Check if voucher is expired
    if (isVoucherExpired()) return false;
    
    // Check voucher type specific conditions
    if (voucherData.type === 'work_order') {
      return voucherData.status === 'active';
    } else if (voucherData.type === 'purchase_escrow') {
      return voucherData.status === 'available';
    } else if (voucherData.type === 'prepaid') {
      return voucherData.status === 'active' && getAvailableAmount() > 0;
    } else if (voucherData.type === 'gift_card') {
      return voucherData.status === 'active';
    }
    
    return false;
  };

  // Get redeem button text
  const getRedeemButtonText = () => {
    if (!voucherData) return 'Redeem Voucher';
    
    if (voucherData.status === 'completed') {
      return 'Voucher Not Available';
    }
    
    if (isVoucherExpired()) {
      return 'Voucher Expired';
    }
    
    if (voucherData.type === 'work_order') {
      return 'Redeem Milestone';
    }
    
    return 'Redeem Voucher';
  };

  // Get available amount for display
  const getAvailableAmount = () => {
    if (!voucherData) return 0;
    
    // Use available_amount if it exists, otherwise fall back to total_amount
    return parseFloat(voucherData.available_amount || voucherData.total_amount) || 0;
  };

  const verifyAccount = async () => {
    if (withdrawForm.accountNumber && withdrawForm.bankName) {
      setIsVerifying(true);
      try {
        console.log('🔍 Verifying bank account:', withdrawForm);
        // Simulate API call for now - in real implementation, this would call a bank verification API
        setTimeout(() => {
          setWithdrawForm(prev => ({
            ...prev,
            accountName: 'John Doe' // This would come from the API
          }));
          setIsVerified(true);
          setIsVerifying(false);
        }, 2000);
      } catch (error) {
        console.error('❌ Error verifying account:', error);
        setIsVerifying(false);
      }
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    
    if (!canRedeemVoucher()) {
      alert('Voucher cannot be redeemed at this time.');
      return;
    }
    
    if (withdrawalMethod === 'bank' && !isVerified) {
      return;
    }

    // Validate amount for prepaid vouchers
    if (voucherData.type === 'prepaid') {
      const amount = parseFloat(redeemAmount);
      if (!amount || amount <= 0) {
        alert('Please enter a valid amount for redemption.');
        return;
      }
      if (amount > getAvailableAmount()) {
        alert('Redemption amount cannot exceed the available amount.');
        return;
      }
    }

    setIsRedeeming(true);
    try {
      console.log('🔍 Starting voucher redemption process');
      console.log('🔍 Withdrawal method:', withdrawalMethod);
      console.log('🔍 Voucher data:', voucherData);
      
      const redemptionData = {
        voucherCode: voucherData.voucher_code,
        ...(voucherData.type === 'prepaid' && { amount: parseFloat(redeemAmount) })
      };

      console.log('📡 Sending redemption request:', redemptionData);
      const response = await apiService.vouchers.redeemVoucher(redemptionData);
      
      console.log('📡 Redemption response:', response);
      console.log('📡 Response success:', response.success);
      console.log('📡 Response message:', response.message);
      console.log('📡 Response data:', response.data);
      
      if (response.success) {
        console.log('✅ Voucher redeemed successfully');
        setShowWithdrawModal(false);
        setShowSuccessModal(true);
        
        // Update voucher data with new status/amount
        if (response.voucher_status) {
          setVoucherData(prev => ({
            ...prev,
            status: response.voucher_status,
            ...(response.remaining_amount !== undefined && { total_amount: response.remaining_amount })
          }));
        }
      } else {
        console.error('❌ Redemption failed:', response.message);
        alert(`Redemption failed: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Error during redemption:', error);
      alert('Error during redemption. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  if (!voucherData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading voucher details...</p>
        </div>
      </div>
    );
  }

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
              onClick={() => navigate('/redeem')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Redeem</span>
            </motion.button>
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Voucher Preview</h1>
            <p className="text-neutral-600">Review voucher details and choose withdrawal method</p>
          </div>

          {/* Voucher Status Alert */}
          {!canRedeemVoucher() && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    {voucherData.status === 'completed' 
                      ? 'Voucher Not Available' 
                      : voucherData.status === 'active' && voucherData.type === 'purchase_escrow'
                      ? 'Voucher Not Yet Available'
                      : isVoucherExpired()
                      ? 'Voucher Expired'
                      : 'Voucher Not Available'
                    }
                  </h3>
                  <p className="text-red-800 text-sm">
                    {voucherData.status === 'completed' 
                      ? 'This voucher has been fully redeemed and is no longer available.'
                      : voucherData.status === 'active' && voucherData.type === 'purchase_escrow'
                      ? 'This purchase escrow voucher needs to be activated before it can be redeemed. Please contact the voucher creator to make it available for redemption.'
                      : isVoucherExpired()
                      ? 'This voucher has expired and cannot be redeemed.'
                      : 'This voucher is not available for redemption at this time.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Voucher Details Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            {/* Work Order Specific Details */}
            {voucherData.type === 'work_order' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Work Order Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Project Title:</span>
                      <span className="text-sm font-semibold text-blue-900">{voucherData.title || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Client Name:</span>
                      <span className="text-sm font-semibold text-blue-900">{voucherData.client_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Client Email:</span>
                      <span className="text-sm font-semibold text-blue-900">{voucherData.client_email || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Due Date:</span>
                      <span className="text-sm font-semibold text-blue-900">
                        {voucherData.due_date ? formatDate(voucherData.due_date) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Payment Type:</span>
                      <span className="text-sm font-semibold text-blue-900 capitalize">
                        {voucherData.payment_type?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-700">Fee Amount:</span>
                      <span className="text-sm font-semibold text-blue-900">
                        {voucherData.fee_amount ? formatCurrency(parseFloat(voucherData.fee_amount)) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                {voucherData.description && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <span className="text-sm font-medium text-blue-700">Description:</span>
                    <p className="text-sm text-blue-900 mt-1">{voucherData.description}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Voucher Details</h2>
              <div className="flex space-x-2">
                <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5" />
                </button>
                <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Voucher Info */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-primary-500 to-accent-600 rounded-lg p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">
                      {voucherData.type === 'prepaid' ? 'Available Amount' : 'Total Amount'}
                    </span>
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded capitalize">
                      {voucherData.status || 'Active'}
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(getAvailableAmount())}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Voucher Code:</span>
                    <span className="font-mono font-medium">{voucherData.voucher_code}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Type:</span>
                    <span className="font-medium capitalize">{voucherData.type?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Available Amount:</span>
                    <span className="font-medium">{formatCurrency(getAvailableAmount())}</span>
                  </div>
                  {voucherData.available_amount !== undefined && voucherData.available_amount !== voucherData.total_amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-600">Total Amount:</span>
                      <span className="font-medium text-neutral-500">{formatCurrency(voucherData.total_amount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">From:</span>
                    <span className="font-medium">{voucherData.user_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">To:</span>
                    <span className="font-medium">{voucherData.recipient_name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Issue Date:</span>
                    <span className="font-medium">{formatDate(voucherData.created_at)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Due Date:</span>
                    <span className="font-medium">
                      {voucherData.due_date ? formatDate(voucherData.due_date) : 'No due date'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${
                      voucherData.status === 'completed' 
                        ? 'bg-gray-100 text-gray-800' 
                        : voucherData.status === 'available'
                        ? 'bg-blue-100 text-blue-800'
                        : voucherData.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {voucherData.status || 'active'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Method:</span>
                    <span className="font-medium capitalize">{location.state?.method || 'code'}</span>
                  </div>
                </div>

                {voucherData.message && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Message from Sender</h4>
                    <p className="text-neutral-700 italic">"{voucherData.message}"</p>
                  </div>
                )}

                {/* Work Order Milestones */}
                {voucherData.type === 'work_order' && voucherData.milestones && Array.isArray(voucherData.milestones) && voucherData.milestones.length > 0 && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-3">Payment Milestones</h4>
                    <div className="space-y-3">
                      {voucherData.milestones.map((milestone, index) => (
                        <div key={milestone.id || index} className="bg-white rounded-lg p-3 border border-neutral-200">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h5 className="font-medium text-neutral-900">
                                {milestone.name || `Milestone ${index + 1}`}
                              </h5>
                              <p className="text-sm text-neutral-600">
                                Due: {formatDate(milestone.due_date)}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              milestone.status === 'completed' 
                                ? 'bg-green-100 text-green-800' 
                                : milestone.status === 'available'
                                ? 'bg-blue-100 text-blue-800'
                                : milestone.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}>
                              {milestone.status || 'pending'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">Amount:</span>
                            <span className="font-semibold text-blue-600">
                              {formatCurrency(parseFloat(milestone.amount) || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-600">Percentage:</span>
                            <span className="font-medium text-neutral-900">
                              {parseFloat(milestone.percentage) || 0}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700">Total Milestones:</span>
                        <span className="text-sm font-semibold text-neutral-900">{voucherData.milestones.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-neutral-700">Total Percentage:</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {voucherData.milestones.reduce((sum, milestone) => sum + (parseFloat(milestone.percentage) || 0), 0)}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prepaid Amount Input */}
          {voucherData.type === 'prepaid' && canRedeemVoucher() && (
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Redemption Amount</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Amount to Redeem (Max: {formatCurrency(getAvailableAmount())})
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">₦</span>
                    <input
                      type="number"
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(e.target.value)}
                      min="0"
                      max={getAvailableAmount()}
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter amount to redeem"
                    />
                  </div>
                  <p className="text-sm text-neutral-600 mt-1">
                    Available: {formatCurrency(getAvailableAmount())}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Withdrawal Options */}
          {canRedeemVoucher() && (
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">Choose Withdrawal Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setWithdrawalMethod('wallet')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    withdrawalMethod === 'wallet'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'wallet' ? 'bg-primary-600' : 'bg-neutral-100'
                    }`}>
                      <WalletIcon className={`w-5 h-5 ${
                        withdrawalMethod === 'wallet' ? 'text-white' : 'text-neutral-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900">Wallet</h3>
                      <p className="text-sm text-neutral-600">Add to your CredoSafe wallet</p>
                    </div>
                    {withdrawalMethod === 'wallet' && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setWithdrawalMethod('bank')}
                  className={`p-4 border-2 rounded-lg transition-colors ${
                    withdrawalMethod === 'bank'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      withdrawalMethod === 'bank' ? 'bg-primary-600' : 'bg-neutral-100'
                    }`}>
                      <Building className={`w-5 h-5 ${
                        withdrawalMethod === 'bank' ? 'text-white' : 'text-neutral-600'
                      }`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-neutral-900">Bank Transfer</h3>
                      <p className="text-sm text-neutral-600">Transfer to your bank account</p>
                    </div>
                    {withdrawalMethod === 'bank' && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                    )}
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!canRedeemVoucher() || (voucherData.type === 'prepaid' && (!redeemAmount || parseFloat(redeemAmount) <= 0))}
                className={`w-full py-3 px-4 rounded-lg transition-colors font-semibold flex items-center justify-center space-x-2 ${
                  canRedeemVoucher() && !(voucherData.type === 'prepaid' && (!redeemAmount || parseFloat(redeemAmount) <= 0))
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>{getRedeemButtonText()}</span>
              </button>
            </div>
          )}

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Important Information</h3>
                <ul className="text-yellow-800 space-y-1 text-sm">
                  <li>• Voucher redemption is irreversible once completed</li>
                  <li>• Bank transfers may take 1-3 business days</li>
                  <li>• Wallet credits are instant and available immediately</li>
                  <li>• Ensure your bank details are correct before proceeding</li>
                  {voucherData.type === 'work_order' && (
                    <li>• Work order vouchers are redeemed by milestone</li>
                  )}
                  {voucherData.type === 'prepaid' && (
                    <li>• Prepaid vouchers can be redeemed partially or fully</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-large max-w-md w-full p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">
                {withdrawalMethod === 'wallet' ? 'Add to Wallet' : 'Bank Transfer'}
              </h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRedeem} className="space-y-4">
              {withdrawalMethod === 'wallet' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WalletIcon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                    Add to Wallet
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {voucherData.type === 'prepaid' 
                      ? `${formatCurrency(parseFloat(redeemAmount) || 0)} will be added to your CredoSafe wallet instantly.`
                      : `${formatCurrency(getAvailableAmount())} will be added to your CredoSafe wallet instantly.`
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={withdrawForm.accountNumber}
                      onChange={(e) => setWithdrawForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Bank Name
                    </label>
                    <select
                      value={withdrawForm.bankName}
                      onChange={(e) => setWithdrawForm(prev => ({ ...prev, bankName: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Bank</option>
                      {banks.map((bank) => (
                        <option key={bank} value={bank}>{bank}</option>
                      ))}
                    </select>
                  </div>

                  {withdrawForm.accountNumber && withdrawForm.bankName && (
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={verifyAccount}
                        disabled={isVerifying}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isVerifying ? 'Verifying...' : 'Verify Account'}
                      </button>
                    </div>
                  )}

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
                </>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRedeeming || (withdrawalMethod === 'bank' && !isVerified)}
                  className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  {isRedeeming ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Redeem Now'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-large max-w-md w-full p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Redemption Successful!</h2>
            <p className="text-neutral-600 mb-6">
              {withdrawalMethod === 'wallet' 
                ? `${voucherData.type === 'prepaid' ? formatCurrency(parseFloat(redeemAmount) || 0) : formatCurrency(getAvailableAmount())} has been added to your wallet.`
                : `${voucherData.type === 'prepaid' ? formatCurrency(parseFloat(redeemAmount) || 0) : formatCurrency(getAvailableAmount())} will be transferred to your bank account within 1-3 business days.`
              }
            </p>
            <button
              onClick={handleGoHome}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
            >
              Go Home
            </button>
          </motion.div>
        </div>
      )}
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default RedeemVoucher; 