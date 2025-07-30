import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Lock,
  DollarSign,
  User,
  Calendar,
  FileText,
  Download,
  Share2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Clock
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const PurchaseEscrowVouchers = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [formData, setFormData] = useState({
    itemTitle: '',
    sellerName: '',
    sellerEmail: '',
    buyerName: '',
    buyerEmail: '',
    itemDescription: '',
    itemValue: '',
    escrowFee: '2.5', // Default 2.5%
    terms: '',
    inspectionPeriod: '7', // Default 7 days
    shippingMethod: 'standard',
    returnPolicy: '14' // Default 14 days
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

  const calculateEscrowFee = () => {
    const value = parseFloat(formData.itemValue) || 0;
    const feePercentage = parseFloat(formData.escrowFee) || 0;
    return (value * feePercentage) / 100;
  };

  const calculateTotal = () => {
    const value = parseFloat(formData.itemValue) || 0;
    const fee = calculateEscrowFee();
    return value + fee;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Purchase Escrow Voucher Data:', formData);
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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Purchase Escrow Vouchers</h1>
            <p className="text-neutral-600">Secure transactions with escrow protection for both buyers and sellers</p>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Escrow Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Item Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Item Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Item Title *
                      </label>
                      <input
                        type="text"
                        value={formData.itemTitle}
                        onChange={(e) => handleInputChange('itemTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter item title"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Item Description
                      </label>
                      <textarea
                        value={formData.itemDescription}
                        onChange={(e) => handleInputChange('itemDescription', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe the item being sold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Item Value *
                      </label>
                      <div className="relative">
                        <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="number"
                          value={formData.itemValue}
                          onChange={(e) => handleInputChange('itemValue', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seller Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Seller Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Seller Name *
                        </label>
                        <input
                          type="text"
                          value={formData.sellerName}
                          onChange={(e) => handleInputChange('sellerName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Seller name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Seller Email *
                        </label>
                        <input
                          type="email"
                          value={formData.sellerEmail}
                          onChange={(e) => handleInputChange('sellerEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="seller@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Buyer Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Buyer Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Buyer Name *
                        </label>
                        <input
                          type="text"
                          value={formData.buyerName}
                          onChange={(e) => handleInputChange('buyerName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Buyer name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Buyer Email *
                        </label>
                        <input
                          type="email"
                          value={formData.buyerEmail}
                          onChange={(e) => handleInputChange('buyerEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="buyer@example.com"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Escrow Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Escrow Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Escrow Fee (%)
                        </label>
                        <input
                          type="number"
                          value={formData.escrowFee}
                          onChange={(e) => handleInputChange('escrowFee', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="2.5"
                          min="0"
                          max="10"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Inspection Period (days)
                        </label>
                        <input
                          type="number"
                          value={formData.inspectionPeriod}
                          onChange={(e) => handleInputChange('inspectionPeriod', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="7"
                          min="1"
                          max="30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Return Policy (days)
                        </label>
                        <input
                          type="number"
                          value={formData.returnPolicy}
                          onChange={(e) => handleInputChange('returnPolicy', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="14"
                          min="1"
                          max="90"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Shipping Method
                      </label>
                      <select
                        value={formData.shippingMethod}
                        onChange={(e) => handleInputChange('shippingMethod', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="standard">Standard Shipping</option>
                        <option value="express">Express Shipping</option>
                        <option value="overnight">Overnight Shipping</option>
                        <option value="pickup">Local Pickup</option>
                      </select>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Additional Terms</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Special Terms & Conditions
                      </label>
                      <textarea
                        value={formData.terms}
                        onChange={(e) => handleInputChange('terms', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter any special terms or conditions"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Create Escrow Voucher</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Cost Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Item Value:</span>
                    <span className="font-medium">${parseFloat(formData.itemValue) || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Escrow Fee ({formData.escrowFee}%):</span>
                    <span className="font-medium">${calculateEscrowFee().toFixed(2)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-neutral-900">Total Amount:</span>
                      <span className="text-lg font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escrow Process */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">How Escrow Works</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Payment Held</h4>
                      <p className="text-sm text-neutral-600">Buyer pays the full amount, held securely in escrow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Item Shipped</h4>
                      <p className="text-sm text-neutral-600">Seller ships the item to the buyer</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Inspection Period</h4>
                      <p className="text-sm text-neutral-600">{formData.inspectionPeriod} days for buyer to inspect</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-blue-600">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-neutral-900">Payment Released</h4>
                      <p className="text-sm text-neutral-600">Funds released to seller after approval</p>
                    </div>
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

                {/* Escrow Voucher Design */}
                <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-neutral-900">Escrow Voucher</h3>
                    <p className="text-neutral-600">Secure Transaction Protection</p>
                  </div>

                  <div className="space-y-4">
                    <div className="border-b border-neutral-200 pb-4">
                      <h4 className="font-semibold text-neutral-900 mb-2">Item Details</h4>
                      <p className="text-neutral-700">{formData.itemTitle || 'Item Title'}</p>
                      <p className="text-sm text-neutral-600">{formData.itemDescription || 'Item description'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-neutral-600">Seller</p>
                        <p className="font-medium text-neutral-900">{formData.sellerName || 'Seller Name'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600">Buyer</p>
                        <p className="font-medium text-neutral-900">{formData.buyerName || 'Buyer Name'}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-neutral-900">Item Value:</span>
                        <span className="font-bold text-green-600">${parseFloat(formData.itemValue) || 0}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-neutral-600">Escrow Fee ({formData.escrowFee}%):</span>
                        <span className="text-sm font-medium">${calculateEscrowFee().toFixed(2)}</span>
                      </div>
                      <div className="border-t border-neutral-200 pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-neutral-900">Total:</span>
                          <span className="text-lg font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-neutral-600">Inspection Period</p>
                        <p className="font-medium text-neutral-900">{formData.inspectionPeriod} days</p>
                      </div>
                      <div>
                        <p className="text-neutral-600">Return Policy</p>
                        <p className="font-medium text-neutral-900">{formData.returnPolicy} days</p>
                      </div>
                    </div>

                    <div className="border-t border-neutral-200 pt-4">
                      <p className="text-xs text-neutral-500">Voucher ID: ESC-{Date.now().toString().slice(-8)}</p>
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
};

export default PurchaseEscrowVouchers; 