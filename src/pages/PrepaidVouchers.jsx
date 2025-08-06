import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  CreditCard,
  DollarSign,
  Store,
  Calendar,
  Download,
  Share2,
  Eye,
  EyeOff,
  CheckCircle,
  MapPin,
  Clock
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api/index';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';
import { useLoading } from '../contexts/LoadingContext';
import useFeeSettings from '../hooks/useFeeSettings';

const PrepaidVouchers = () => {
  const navigate = useNavigate();
  const { fees, loading: feeLoading, error: feeError, calculateFee } = useFeeSettings();
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const { startLoading, stopLoading, isLoading: checkLoading } = useLoading();
  const [formData, setFormData] = useState({
    voucherAmount: '',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    businessCategory: 'all',
    expiryDate: '',
    message: '',
    autoReload: false,
    reloadAmount: '',
    reloadFrequency: 'monthly'
  });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        console.log('🔄 Fetching balance...');
        const response = await apiService.vouchers.getBalance();
        console.log('📡 Balance response:', response);
        
        if (response.success) {
          setUserBalance(response.data?.balance || 0);
          console.log('✅ Balance set to:', response.data?.balance || 0);
        } else {
          console.error('❌ Balance fetch failed:', response.message);
          dispatch(showToast({
            message: response.message || 'Failed to fetch balance',
            type: 'error'
          }));
        }
      } catch (error) {
        console.error('❌ Balance fetch error:', error);
        console.error('❌ Error details:', error.message);
        dispatch(showToast({
          message: `Failed to fetch balance: ${error.message}`,
          type: 'error'
        }));
      }
    };
    fetchBalance();
  }, [dispatch]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const businessCategories = [
    { value: 'all', label: 'All Businesses', description: 'Use at any participating business' },
    { value: 'restaurants', label: 'Restaurants & Food', description: 'Dining and food services' },
    { value: 'retail', label: 'Retail & Shopping', description: 'Stores and shopping centers' },
    { value: 'services', label: 'Services', description: 'Professional and personal services' },
    { value: 'entertainment', label: 'Entertainment', description: 'Movies, events, and activities' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const voucherAmount = parseFloat(formData.voucherAmount) || 0;
    const fee = calculateFee('voucher_creation', voucherAmount);
    const totalWithFee = voucherAmount + fee;
    // Check if user has sufficient balance for amount + fee
    if (userBalance < totalWithFee) {
      dispatch(showToast({
        message: `Insufficient balance. You need ₦${totalWithFee.toLocaleString()} (including ₦${fee.toLocaleString()} fee) but have ₦${userBalance.toLocaleString()}`,
        type: 'error'
      }));
      return;
    }
    
    try {
      startLoading('create-prepaid', 'Creating prepaid voucher...');
      const voucherData = {
        voucherAmount: parseFloat(formData.voucherAmount),
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        recipientPhone: formData.recipientPhone,
        businessCategory: formData.businessCategory,
        expiryDate: formData.expiryDate,
        message: formData.message,
        autoReload: formData.autoReload,
        reloadAmount: formData.autoReload ? parseFloat(formData.reloadAmount) : undefined,
        reloadFrequency: formData.autoReload ? formData.reloadFrequency : undefined
      };

      const response = await apiService.vouchers.createPrepaid(voucherData);
      
      if (response.success) {
        dispatch(showToast({
          message: 'Prepaid voucher created successfully!',
          type: 'success'
        }));
        navigate('/dashboard');
        const balanceResponse = await apiService.vouchers.getBalance();
        if (balanceResponse.success) {
          setUserBalance(balanceResponse.data?.balance || 0);
        }
      } else {
        dispatch(showToast({
          message: response.message || 'Failed to create voucher',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('Voucher creation error:', error);
      dispatch(showToast({
        message: 'Failed to create voucher',
        type: 'error'
      }));
    } finally {
      stopLoading('create-prepaid');
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
              onClick={() => navigate('/create-voucher')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Create Voucher</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Prepaid Vouchers</h1>
            <p className="text-neutral-600">Load funds and use at participating businesses with instant redemption</p>
          </div>

          {/* Balance Display */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Available Balance</h2>
                <p className="text-2xl font-bold text-primary-600">
                  {showBalance ? `₦${userBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '••••••'}
                </p>
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm">{showBalance ? 'Hide' : 'Show'} Balance</span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Voucher Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Voucher Amount</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Amount to Load *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="number"
                          id="voucherAmount"
                          value={formData.voucherAmount}
                          onChange={e => handleInputChange('voucherAmount', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter amount"
                          min="1"
                          required
                        />
                      </div>
                      <div className="text-xs text-blue-700 mt-1">
                        Fee: ₦{calculateFee('voucher_creation', parseFloat(formData.voucherAmount) || 0).toFixed(2)}
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Quick Amounts
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[25, 50, 100, 200, 500, 1000].map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleInputChange('voucherAmount', amount.toString())}
                            className="px-3 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors text-sm"
                          >
                            ₦{amount}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recipient Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Recipient Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        value={formData.recipientName}
                        onChange={(e) => handleInputChange('recipientName', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter recipient name"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={formData.recipientEmail}
                          onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="recipient@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.recipientPhone}
                          onChange={(e) => handleInputChange('recipientPhone', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Category */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Business Category</h3>
                    
                    <div className="space-y-3">
                      {businessCategories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => handleInputChange('businessCategory', category.value)}
                          className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                            formData.businessCategory === category.value
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-neutral-300 hover:border-neutral-400'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <CheckCircle className={`w-5 h-5 ${
                              formData.businessCategory === category.value ? 'text-purple-600' : 'text-neutral-400'
                            }`} />
                            <div>
                              <h4 className="font-medium text-neutral-900">{category.label}</h4>
                              <p className="text-sm text-neutral-600">{category.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Additional Settings</h3>
                    
                    {/* <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div> */}

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Personal Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Add a personal message to the recipient"
                      />
                    </div>

                    {/* Auto-Reload */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="autoReload"
                          checked={formData.autoReload}
                          onChange={(e) => handleInputChange('autoReload', e.target.checked)}
                          className="w-4 h-4 text-purple-600 border-neutral-300 rounded focus:ring-purple-500"
                        />
                        <label htmlFor="autoReload" className="text-sm font-medium text-neutral-700">
                          Enable Auto-Reload
                        </label>
                      </div>
                      
                      {formData.autoReload && (
                        <div className="ml-7 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Reload Amount
                            </label>
                            <div className="relative">
                              <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                              <input
                                type="number"
                                value={formData.reloadAmount}
                                onChange={(e) => handleInputChange('reloadAmount', e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                              Reload Frequency
                            </label>
                            <select
                              value={formData.reloadFrequency}
                              onChange={(e) => handleInputChange('reloadFrequency', e.target.value)}
                              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="weekly">Weekly</option>
                              <option value="monthly">Monthly</option>
                              <option value="quarterly">Quarterly</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={checkLoading('create-prepaid')}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {checkLoading('create-prepaid') ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Prepaid Voucher...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        <span>Create Prepaid Voucher</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              {/* Business Network */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Participating Businesses</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Store className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Local Restaurants</p>
                      <p className="text-sm text-neutral-600">50+ dining establishments</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Store className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Retail Stores</p>
                      <p className="text-sm text-neutral-600">100+ shopping locations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg">
                    <Store className="w-5 h-5 text-neutral-500" />
                    <div>
                      <p className="font-medium text-neutral-900">Service Providers</p>
                      <p className="text-sm text-neutral-600">75+ service businesses</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Prepaid Benefits</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Instant redemption at participating businesses</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">No transaction fees for purchases</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Secure digital wallet protection</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Real-time balance tracking</span>
                  </div>
                </div>
              </div>

              {/* Voucher Preview */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Voucher Preview</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prepaid Voucher Design */}
                <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">Prepaid Voucher</h3>
                    <p className="text-neutral-600">Digital Wallet Credit</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <p className="text-sm text-neutral-600 mb-1">Available Balance</p>
                      <p className="text-3xl font-bold text-purple-600">
                        ₦{parseFloat(formData.voucherAmount) || 0}
                      </p>
                      <p className="text-purple-700 mt-2 text-sm">
                        Fee: ₦{feeLoading ? '...' : (calculateFee('voucher_creation', parseFloat(formData.voucherAmount) || 0)).toFixed(2)}
                      </p>
                      <p className="text-purple-600 text-xs">Total: ₦{feeLoading ? '...' : ((parseFloat(formData.voucherAmount) || 0) + calculateFee('voucher_creation', parseFloat(formData.voucherAmount) || 0)).toFixed(2)}</p>
                    </div>

                    <div className="border-b border-neutral-200 pb-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Recipient</h4>
                      <p className="text-neutral-700">{formData.recipientName || 'Recipient Name'}</p>
                      {formData.recipientEmail && (
                        <p className="text-sm text-neutral-600">{formData.recipientEmail}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-600">Category</p>
                        <p className="font-medium text-neutral-900">
                          {businessCategories.find(c => c.value === formData.businessCategory)?.label || 'All Businesses'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Expires</p>
                        <p className="font-medium text-neutral-900">
                          {formData.expiryDate ? new Date(formData.expiryDate).toLocaleDateString() : 'No expiry'}
                        </p>
                      </div>
                    </div>

                    {formData.message && (
                      <div className="bg-white rounded-lg p-4">
                        <p className="text-sm text-neutral-600 mb-1">Message</p>
                        <p className="text-neutral-700 italic">"{formData.message}"</p>
                      </div>
                    )}

                    {formData.autoReload && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Auto-Reload Enabled</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          ₦{formData.reloadAmount || 0} every {formData.reloadFrequency}
                        </p>
                      </div>
                    )}

                    <div className="border-t border-neutral-200 pt-4">
                      <p className="text-xs text-neutral-500">Voucher ID: PP-{Date.now().toString().slice(-8)}</p>
                      <p className="text-xs text-neutral-500">Created: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
}

export default PrepaidVouchers;