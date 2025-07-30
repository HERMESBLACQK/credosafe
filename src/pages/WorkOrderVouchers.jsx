import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Handshake,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  User,
  FileText,
  Download,
  Share2,
  Eye,
  EyeOff
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const WorkOrderVouchers = () => {
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState(1);
  const [showBalance, setShowBalance] = useState(true);
  const [formData, setFormData] = useState({
    projectTitle: '',
    clientName: '',
    clientEmail: '',
    totalAmount: '',
    paymentType: 'milestone', // 'milestone' or 'full'
    milestones: [
      { name: '', percentage: '' }
    ],
    description: '',
    dueDate: '',
    terms: ''
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

  const handleMilestoneChange = (index, field, value) => {
    const updatedMilestones = [...formData.milestones];
    updatedMilestones[index] = {
      ...updatedMilestones[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      milestones: updatedMilestones
    }));
  };

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { name: '', percentage: '' }]
    }));
  };

  const removeMilestone = (index) => {
    if (formData.milestones.length > 1) {
      setFormData(prev => ({
        ...prev,
        milestones: prev.milestones.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateMilestoneAmount = (percentage) => {
    const total = parseFloat(formData.totalAmount) || 0;
    const percent = parseFloat(percentage) || 0;
    return (total * percent) / 100;
  };

  const calculateTotalPercentage = () => {
    return formData.milestones.reduce((sum, milestone) => {
      return sum + (parseFloat(milestone.percentage) || 0);
    }, 0);
  };

  const calculateTotal = () => {
    if (formData.paymentType === 'full') {
      return parseFloat(formData.totalAmount) || 0;
    }
    return parseFloat(formData.totalAmount) || 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Work Order Voucher Data:', formData);
  };

  const voucherDesigns = [
    {
      id: 1,
      name: "Professional Design",
      preview: "Clean, corporate layout with emphasis on project details"
    },
    {
      id: 2,
      name: "Modern Design", 
      preview: "Contemporary layout with visual elements and icons"
    }
  ];

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
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Handshake className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Work Order Vouchers</h1>
            <p className="text-neutral-600">Create secure vouchers for work orders with milestone or full payment options</p>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-6">Voucher Details</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Project Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Project Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        value={formData.projectTitle}
                        onChange={(e) => handleInputChange('projectTitle', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter project title"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Client Name *
                        </label>
                        <input
                          type="text"
                          value={formData.clientName}
                          onChange={(e) => handleInputChange('clientName', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Client name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Client Email *
                        </label>
                        <input
                          type="email"
                          value={formData.clientEmail}
                          onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="client@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Project Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Describe the project scope and requirements"
                      />
                    </div>
                  </div>

                  {/* Payment Type */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Payment Structure</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentType', 'milestone')}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          formData.paymentType === 'milestone'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className={`w-5 h-5 ${
                            formData.paymentType === 'milestone' ? 'text-primary-600' : 'text-neutral-400'
                          }`} />
                          <span className="font-medium">Milestone Payments</span>
                        </div>
                        <p className="text-sm text-neutral-600">Pay based on project milestones</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInputChange('paymentType', 'full')}
                        className={`p-4 border-2 rounded-lg text-left transition-colors ${
                          formData.paymentType === 'full'
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-neutral-300 hover:border-neutral-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className={`w-5 h-5 ${
                            formData.paymentType === 'full' ? 'text-primary-600' : 'text-neutral-400'
                          }`} />
                          <span className="font-medium">Full Payment</span>
                        </div>
                        <p className="text-sm text-neutral-600">Pay the full amount upfront</p>
                      </button>
                    </div>
                  </div>

                  {/* Amount Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Amount Details</h3>
                    
                    {formData.paymentType === 'full' ? (
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Total Amount *
                        </label>
                        <div className="relative">
                          <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <input
                            type="number"
                            value={formData.totalAmount}
                            onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="0.00"
                            min="0"
                            step="0.01"
                            required
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-neutral-900">Milestones</h4>
                          <button
                            type="button"
                            onClick={addMilestone}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            + Add Milestone
                          </button>
                        </div>

                        {/* Total Amount for Milestones */}
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Total Project Amount *
                          </label>
                          <div className="relative">
                            <DollarSign className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                            <input
                              type="number"
                              value={formData.totalAmount}
                              onChange={(e) => handleInputChange('totalAmount', e.target.value)}
                              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              required
                            />
                          </div>
                        </div>
                        
                        {formData.milestones.map((milestone, index) => (
                          <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-neutral-700">Milestone {index + 1}</span>
                              {formData.milestones.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(index)}
                                  className="text-red-600 hover:text-red-700 text-sm"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs text-neutral-600 mb-1">Name</label>
                                <input
                                  type="text"
                                  value={milestone.name}
                                  onChange={(e) => handleMilestoneChange(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                  placeholder="e.g., Design Phase"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-neutral-600 mb-1">Percentage (%)</label>
                                <input
                                  type="number"
                                  value={milestone.percentage}
                                  onChange={(e) => handleMilestoneChange(index, 'percentage', e.target.value)}
                                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                />
                              </div>
                            </div>
                            
                            {/* Calculated Amount Display */}
                            {milestone.percentage && formData.totalAmount && (
                              <div className="bg-blue-50 rounded-md p-3">
                                <div className="flex justify-between items-center text-sm">
                                  <span className="text-neutral-600">Calculated Amount:</span>
                                  <span className="font-semibold text-blue-600">
                                    ${calculateMilestoneAmount(milestone.percentage).toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Summary */}
                        <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium text-neutral-900">Total Amount:</span>
                            <span className="text-lg font-bold text-primary-600">
                              ${calculateTotal().toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Total Percentage:</span>
                            <span className={`text-sm font-medium ${
                              calculateTotalPercentage() === 100 ? 'text-green-600' : 
                              calculateTotalPercentage() > 100 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {calculateTotalPercentage().toFixed(1)}%
                            </span>
                          </div>
                          {calculateTotalPercentage() !== 100 && (
                            <div className="text-xs text-neutral-500">
                              {calculateTotalPercentage() < 100 
                                ? `Remaining: ${(100 - calculateTotalPercentage()).toFixed(1)}%` 
                                : `Exceeds by: ${(calculateTotalPercentage() - 100).toFixed(1)}%`
                              }
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Additional Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Terms & Conditions
                      </label>
                      <textarea
                        value={formData.terms}
                        onChange={(e) => handleInputChange('terms', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter any specific terms or conditions"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
                  >
                    <Handshake className="w-5 h-5" />
                    <span>Create Work Order Voucher</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              {/* Design Selection */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Voucher Design</h2>
                <div className="grid grid-cols-2 gap-4">
                  {voucherDesigns.map((design) => (
                    <button
                      key={design.id}
                      onClick={() => setSelectedDesign(design.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedDesign === design.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-neutral-300 hover:border-neutral-400'
                      }`}
                    >
                      <h3 className="font-medium text-neutral-900 mb-1">{design.name}</h3>
                      <p className="text-sm text-neutral-600">{design.preview}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voucher Preview */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-neutral-900">Preview</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Voucher Design 1 - Professional */}
                {selectedDesign === 1 && (
                  <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Handshake className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-neutral-900">Work Order Voucher</h3>
                      <p className="text-neutral-600">CredoSafe Secure Transaction</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border-b border-neutral-200 pb-4">
                        <h4 className="font-semibold text-neutral-900 mb-2">Project Details</h4>
                        <p className="text-neutral-700">{formData.projectTitle || 'Project Title'}</p>
                        <p className="text-sm text-neutral-600">{formData.description || 'Project description'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-neutral-600">Client</p>
                          <p className="font-medium text-neutral-900">{formData.clientName || 'Client Name'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-neutral-600">Amount</p>
                          <p className="font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
                        </div>
                      </div>

                      {formData.paymentType === 'milestone' && formData.milestones.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">Milestones</h4>
                          <div className="space-y-2">
                            {formData.milestones.map((milestone, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{milestone.name || `Milestone ${index + 1}`}</span>
                                <span className="font-medium">${calculateMilestoneAmount(milestone.percentage).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-t border-neutral-200 pt-4">
                        <p className="text-xs text-neutral-500">Voucher ID: WO-{Date.now().toString().slice(-8)}</p>
                        <p className="text-xs text-neutral-500">Created: {new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Voucher Design 2 - Modern */}
                {selectedDesign === 2 && (
                  <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <Handshake className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-neutral-900">Work Order</h3>
                          <p className="text-sm text-neutral-600">Secure Voucher</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-neutral-500">Voucher ID</p>
                        <p className="font-mono text-sm font-bold text-neutral-900">WO-{Date.now().toString().slice(-8)}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-neutral-900 mb-2 flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>Project Information</span>
                        </h4>
                        <p className="text-neutral-700 font-medium">{formData.projectTitle || 'Project Title'}</p>
                        <p className="text-sm text-neutral-600 mt-1">{formData.description || 'Project description'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <User className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-600">Client</span>
                          </div>
                          <p className="font-medium text-neutral-900">{formData.clientName || 'Client Name'}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <DollarSign className="w-4 h-4 text-neutral-500" />
                            <span className="text-sm text-neutral-600">Total</span>
                          </div>
                          <p className="font-bold text-indigo-600 text-lg">${calculateTotal().toFixed(2)}</p>
                        </div>
                      </div>

                      {formData.paymentType === 'milestone' && formData.milestones.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                          <h4 className="font-semibold text-neutral-900 mb-3 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Payment Milestones</span>
                          </h4>
                          <div className="space-y-2">
                            {formData.milestones.map((milestone, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium text-neutral-900">{milestone.name || `Milestone ${index + 1}`}</p>
                                  <p className="text-xs text-neutral-500">{milestone.percentage || '0'}%</p>
                                </div>
                                <span className="font-bold text-indigo-600">${calculateMilestoneAmount(milestone.percentage).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span>Created: {new Date().toLocaleDateString()}</span>
                        <span>CredoSafe Platform</span>
                      </div>
                    </div>
                  </div>
                )}
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

export default WorkOrderVouchers; 