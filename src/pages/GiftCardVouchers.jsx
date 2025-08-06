import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Gift,
  DollarSign,
  User,
  Calendar,
  Download,
  Share2,
  Eye,
  EyeOff,
  Heart,
  Star,
  Sparkles,
  Palette,
  CheckCircle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api/index';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';
import { useError } from '../contexts/ErrorContext';
import { useLoading } from '../contexts/LoadingContext';
import useFeeSettings from '../hooks/useFeeSettings';

const GiftCardVouchers = () => {
  const navigate = useNavigate();
  const { fees, loading: feeLoading, error: feeError, calculateFee } = useFeeSettings();
  const dispatch = useDispatch();
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [selectedDesign, setSelectedDesign] = useState('birthday');
  const [themes, setThemes] = useState([]);
  const { startLoading, stopLoading, isLoading: checkLoading } = useLoading();
  const [formData, setFormData] = useState({
    giftAmount: '',
    recipientName: '',
    recipientEmail: '',
    senderName: '',
    senderEmail: '',
    message: '',
    isAnonymous: false,
    deliveryMethod: 'email',
    deliveryDate: '',
    theme: 'birthday'
  });

  // Calculate fee for current gift amount
  const giftAmount = parseFloat(formData.giftAmount) || 0;
  const fee = calculateFee('voucher_creation', giftAmount);
  const totalWithFee = giftAmount + fee;

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading('fetch-data', 'Loading data...');
        
        // Fetch balance
        console.log('🔄 Fetching balance...');
        const balanceResponse = await apiService.vouchers.getBalance();
        console.log('📡 Balance response:', balanceResponse);
        
        if (balanceResponse.success) {
          setUserBalance(balanceResponse.data?.balance || 0);
          console.log('✅ Balance set to:', balanceResponse.data?.balance || 0);
        } else {
          console.error('❌ Balance fetch failed:', balanceResponse.message);
          dispatch(showToast({
            message: balanceResponse.message || 'Failed to fetch balance',
            type: 'error'
          }));
        }

        // Fetch themes
        const themesResponse = await apiService.themes.getByVoucherType('gift_card');
        console.log('🎨 Themes response:', themesResponse);
        if (themesResponse.success) {
          console.log('✅ Themes data:', themesResponse.data);
          setThemes(themesResponse.data || []);
          // Set first theme as default if available
          if (themesResponse.data && themesResponse.data.length > 0) {
            setSelectedDesign(themesResponse.data[0].name);
          }
        } else {
          console.error('Failed to fetch themes:', themesResponse.message);
        }
      } catch (error) {
        console.error('❌ Data fetch error:', error);
        console.error('❌ Error details:', error.message);
        dispatch(showToast({
          message: `Failed to fetch data: ${error.message}`,
          type: 'error'
        }));
      } finally {
        stopLoading('fetch-data');
      }
    };
    fetchData();
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

  // Helper function to get icon component
  const getIconComponent = (iconEmoji) => {
    switch (iconEmoji) {
      case '🎂':
        return <Sparkles className="w-8 h-8" />;
      case '🎄':
        return <Heart className="w-8 h-8" />;
      case '✨':
        return <Star className="w-8 h-8" />;
      case '🌊':
        return <Gift className="w-8 h-8" />;
      case '🌿':
        return <Gift className="w-8 h-8" />;
      case '🌅':
        return <Sparkles className="w-8 h-8" />;
      default:
        return <Gift className="w-8 h-8" />;
    }
  };

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user has sufficient balance (amount + fee)
    if (userBalance < totalWithFee) {
      dispatch(showToast({
        message: `Insufficient balance. You need ₦${totalWithFee.toLocaleString()} (including ₦${fee.toLocaleString()} fee) but have ₦${userBalance.toLocaleString()}`,
        type: 'error'
      }));
      return;
    }
    const giftAmount = parseFloat(formData.giftAmount) || 0;
    if (userBalance < giftAmount) {
      dispatch(showToast({
        message: `Insufficient balance. You need ₦${giftAmount.toLocaleString()} but have ₦${userBalance.toLocaleString()}`,
        type: 'error'
      }));
      return;
    }
    
    try {
      startLoading('create-gift-card', 'Creating your gift card...');
      const voucherData = {
        giftAmount: parseFloat(formData.giftAmount),
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        senderName: formData.isAnonymous ? undefined : formData.senderName,
        senderEmail: formData.isAnonymous ? undefined : formData.senderEmail,
        message: formData.message,
        isAnonymous: formData.isAnonymous,
        deliveryMethod: formData.deliveryMethod,
        deliveryDate: formData.deliveryMethod === 'scheduled' ? formData.deliveryDate : undefined,
        theme: selectedDesign
      };

      const response = await apiService.vouchers.createGiftCard(voucherData);
      
      if (response.success) {
        dispatch(showToast({
          message: 'Gift card voucher created successfully!',
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
      stopLoading('create-gift-card');
    }
  };

  const selectedDesignData = themes && themes.length > 0 ? themes.find(t => t.name === selectedDesign) : null;

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
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Gift className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Gift Card Vouchers</h1>
            <p className="text-neutral-600">Send personalized or anonymous gift cards with beautiful designs</p>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Gift Card Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Gift Amount</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Amount *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="number"
                          value={formData.giftAmount}
                          onChange={(e) => handleInputChange('giftAmount', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    {/* Quick Amount Buttons */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Quick Amounts
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((amount) => (
                          <button
                            key={amount}
                            type="button"
                            onClick={() => handleInputChange('giftAmount', amount.toString())}
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

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        value={formData.recipientEmail}
                        onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="recipient@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* Sender Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Sender Information</h3>
                    
                    <div className="flex items-center space-x-3 mb-4">
                      <input
                        type="checkbox"
                        id="isAnonymous"
                        checked={formData.isAnonymous}
                        onChange={(e) => handleInputChange('isAnonymous', e.target.checked)}
                        className="w-4 h-4 text-pink-600 border-neutral-300 rounded focus:ring-pink-500"
                      />
                      <label htmlFor="isAnonymous" className="text-sm font-medium text-neutral-700">
                        Send anonymously
                      </label>
                    </div>

                    {!formData.isAnonymous && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Sender Name
                          </label>
                          <input
                            type="text"
                            value={formData.senderName}
                            onChange={(e) => handleInputChange('senderName', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Your name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Sender Email
                          </label>
                          <input
                            type="email"
                            value={formData.senderEmail}
                            onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Personal Message */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Personal Message</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Message (Optional)
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Write a personal message to the recipient..."
                        maxLength={200}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        {formData.message.length}/200 characters
                      </p>
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Delivery Options</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Delivery Method
                      </label>
                      <select
                        value={formData.deliveryMethod}
                        onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="email">Email Delivery</option>
                        <option value="sms">SMS Delivery</option>
                        <option value="scheduled">Scheduled Delivery</option>
                      </select>
                    </div>

                    {formData.deliveryMethod === 'scheduled' && (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Delivery Date
                        </label>
                        <input
                          type="datetime-local"
                          value={formData.deliveryDate}
                          onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={checkLoading('create-gift-card')}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {checkLoading('create-gift-card') ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Gift Card...</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-5 h-5" />
                        <span>Create Gift Card</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              {/* Design Selection */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Choose Design</h2>
                {checkLoading('fetch-data') ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                    <p className="text-neutral-600 mt-2">Loading themes...</p>
                  </div>
                                 ) : themes && themes.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                     {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => setSelectedDesign(theme.name)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          selectedDesign === theme.name
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                        <div className={`w-12 h-12 bg-gradient-to-r ${theme.gradient_colors} rounded-lg flex items-center justify-center mb-3`}>
                          <div className="text-white text-xl">
                            {theme.icon_emoji}
                          </div>
                        </div>
                        <h3 className="font-medium text-neutral-900 mb-1">{theme.display_name}</h3>
                        <p className="text-sm text-neutral-600">{theme.description}</p>
                    </button>
                  ))}
                </div>
                 ) : (
                   <div className="text-center py-8">
                     <p className="text-neutral-600">No themes available</p>
                     <p className="text-sm text-neutral-500 mt-1">Please try refreshing the page</p>
                   </div>
                 )}
              </div>

              {/* Gift Card Preview */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Gift Card Preview</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Gift Card Design */}
                 <div className={`border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br ${selectedDesignData?.gradient_colors} text-white`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                       <div className="text-white text-2xl">
                         {selectedDesignData?.icon_emoji}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Gift Card</h3>
                    <p className="text-white/80">CredoSafe Digital Gift</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <p className="text-white/80 mb-1">Gift Amount</p>
                      <p className="text-3xl font-bold">
                         ₦{parseFloat(formData.giftAmount) || 0}
                      </p>
                      <p className="text-white/70 mt-2 text-sm">
                        Fee: ₦{feeLoading ? '...' : fee}
                      </p>
                      <p className="text-white/60 text-xs">Total: ₦{feeLoading ? '...' : totalWithFee}</p>
                    </div>

                    <div className="border-t border-white/20 pt-4">
                      <h4 className="font-semibold mb-2">To:</h4>
                      <p className="font-medium">{formData.recipientName || 'Recipient Name'}</p>
                    </div>

                    {!formData.isAnonymous && formData.senderName && (
                      <div>
                        <h4 className="font-semibold mb-2">From:</h4>
                        <p className="font-medium">{formData.senderName}</p>
                      </div>
                    )}

                    {formData.message && (
                      <div className="bg-white/20 rounded-lg p-4">
                        <p className="text-sm text-white/80 mb-1">Message:</p>
                        <p className="italic">"{formData.message}"</p>
                      </div>
                    )}

                    <div className="border-t border-white/20 pt-4">
                      <p className="text-xs text-white/60">Gift Card ID: GC-{Date.now().toString().slice(-8)}</p>
                      <p className="text-xs text-white/60">Created: {new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Gift Card Features</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Instant digital delivery</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Use at any participating business</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Beautiful customizable designs</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-neutral-700">Anonymous or personalized sending</span>
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
};

export default GiftCardVouchers; 