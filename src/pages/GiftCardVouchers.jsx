import React, { useState } from 'react';
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

const GiftCardVouchers = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState(1);
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

  const giftCardDesigns = [
    {
      id: 1,
      name: "Birthday Celebration",
      theme: "birthday",
      colors: "from-pink-500 to-purple-600",
      icon: <Sparkles className="w-8 h-8" />,
      description: "Perfect for birthday celebrations"
    },
    {
      id: 2,
      name: "Holiday Joy",
      theme: "holiday",
      colors: "from-red-500 to-green-600",
      icon: <Heart className="w-8 h-8" />,
      description: "Festive holiday design"
    },
    {
      id: 3,
      name: "Elegant Gold",
      theme: "elegant",
      colors: "from-yellow-500 to-orange-600",
      icon: <Star className="w-8 h-8" />,
      description: "Sophisticated gold theme"
    },
    {
      id: 4,
      name: "Ocean Blue",
      theme: "ocean",
      colors: "from-blue-500 to-cyan-600",
      icon: <Gift className="w-8 h-8" />,
      description: "Calming ocean vibes"
    },
    {
      id: 5,
      name: "Nature Green",
      theme: "nature",
      colors: "from-green-500 to-emerald-600",
      icon: <Gift className="w-8 h-8" />,
      description: "Fresh and natural"
    },
    {
      id: 6,
      name: "Sunset Gradient",
      theme: "sunset",
      colors: "from-orange-500 to-pink-600",
      icon: <Sparkles className="w-8 h-8" />,
      description: "Warm sunset colors"
    }
  ];

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Gift Card Voucher Data:', formData);
  };

  const selectedDesignData = giftCardDesigns.find(d => d.id === selectedDesign);

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
                  {showBalance ? '$2,450.00' : '••••••'}
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
                            ${amount}
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
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
                  >
                    <Gift className="w-5 h-5" />
                    <span>Create Gift Card</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              {/* Design Selection */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Choose Design</h2>
                <div className="grid grid-cols-2 gap-4">
                  {giftCardDesigns.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedDesign === design.id
                          ? 'border-pink-600 bg-pink-50'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${design.colors} rounded-lg flex items-center justify-center mb-3`}>
                        <div className="text-white">
                          {design.icon}
                        </div>
                      </div>
                      <h3 className="font-medium text-neutral-900 mb-1">{design.name}</h3>
                      <p className="text-sm text-neutral-600">{design.description}</p>
                    </button>
                  ))}
                </div>
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
                <div className={`border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br ${selectedDesignData?.colors} text-white`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <div className="text-white">
                        {selectedDesignData?.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Gift Card</h3>
                    <p className="text-white/80">CredoSafe Digital Gift</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                      <p className="text-white/80 mb-1">Gift Amount</p>
                      <p className="text-3xl font-bold">
                        ${parseFloat(formData.giftAmount) || 0}
                      </p>
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