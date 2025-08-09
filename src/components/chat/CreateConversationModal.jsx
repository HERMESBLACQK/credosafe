import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

const CreateConversationModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    issueType: '',
    subject: '',
    message: '',
    voucherCode: '',
    recipientEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voucherDetails, setVoucherDetails] = useState(null);
  const [isValidatingVoucher, setIsValidatingVoucher] = useState(false);

  const issueTypes = [
    { value: 'account', label: 'Account Issues', icon: '👤', description: 'Login, registration, profile issues' },
    { value: 'transaction', label: 'Transaction Issues', icon: '💰', description: 'Payment, withdrawal, balance issues' },
    { value: 'voucher', label: 'Voucher Issues', icon: '🎫', description: 'Voucher creation, redemption, tracking' },
    { value: 'dispute', label: 'Dispute Issues', icon: '⚖️', description: 'Disputes between users, voucher conflicts' },
    { value: 'general', label: 'General Support', icon: '💬', description: 'General questions and support' }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.issueType) {
      newErrors.issueType = 'Please select an issue type';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Initial message is required';
    }

    if (formData.issueType === 'dispute' && !formData.voucherCode.trim()) {
      newErrors.voucherCode = 'Voucher code is required for dispute issues';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating conversation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear voucher details when issue type changes
    if (field === 'issueType') {
      setVoucherDetails(null);
    }
  };

  const validateVoucher = async (voucherCode) => {
    if (!voucherCode.trim()) return;
    
    try {
      setIsValidatingVoucher(true);
      
      // Get API base URL dynamically
      const getApiBaseUrl = () => {
        if (window.location.hostname.includes('onrender.com') || window.location.protocol === 'https:') {
          return 'https://server-b6ns.onrender.com/api';
        }
        return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      };
      
      const response = await fetch(`${getApiBaseUrl()}/vouchers/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ voucherCode })
      });
      
      if (response.ok) {
        const data = await response.json();
        setVoucherDetails(data.data.voucher);
        setErrors(prev => ({ ...prev, voucherCode: '' }));
      } else {
        const error = await response.json();
        setVoucherDetails(null);
        setErrors(prev => ({ ...prev, voucherCode: error.message || 'Invalid voucher code' }));
      }
    } catch (error) {
      setVoucherDetails(null);
      setErrors(prev => ({ ...prev, voucherCode: 'Failed to validate voucher' }));
    } finally {
      setIsValidatingVoucher(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create New Conversation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Issue Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of issue do you need help with?
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {issueTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => handleInputChange('issueType', type.value)}
                    className={cn(
                      "p-4 border-2 rounded-lg cursor-pointer transition-colors",
                      formData.issueType === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{type.label}</h3>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.issueType && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.issueType}
                </p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of your issue..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.subject && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Voucher Code (for disputes) */}
            {formData.issueType === 'dispute' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voucher Code *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.voucherCode}
                    onChange={(e) => handleInputChange('voucherCode', e.target.value)}
                    onBlur={() => validateVoucher(formData.voucherCode)}
                    placeholder="Enter the voucher code related to your dispute..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => validateVoucher(formData.voucherCode)}
                    disabled={isValidatingVoucher || !formData.voucherCode.trim()}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isValidatingVoucher ? 'Validating...' : 'Validate'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Please provide the voucher code to help us identify the specific voucher involved in your dispute.
                </p>
                {errors.voucherCode && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.voucherCode}
                  </p>
                )}
                {voucherDetails && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-800">✅ Voucher Validated</p>
                    <p className="text-xs text-green-700 mt-1">
                      Code: {voucherDetails.voucher_code} | Type: {voucherDetails.voucher_type} | Amount: ₦{voucherDetails.amount?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Recipient Email (for disputes) */}
            {formData.issueType === 'dispute' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                  placeholder="Email of the other party involved..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="mt-1 text-xs text-gray-500">
                  If you know the email of the other party involved in the dispute, please provide it.
                </p>
              </div>
            )}

            {/* Initial Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Message *
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Describe your issue in detail..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
              {errors.message && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={(e) => handleSubmit(e)}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Conversation'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateConversationModal;
