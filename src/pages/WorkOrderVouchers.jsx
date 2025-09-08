import React, { useState, useEffect } from 'react';
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
import apiService from '../api/index';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';
import { useLoading } from '../contexts/LoadingContext';
import useFeeSettings from '../hooks/useFeeSettings';

const WorkOrderVouchers = () => {
  const navigate = useNavigate();
  const { calculateFee } = useFeeSettings();
  const dispatch = useDispatch();
  const [selectedDesign, setSelectedDesign] = useState('professional');
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [themes, setThemes] = useState([]);
  const [userData, setUserData] = useState(null);
  const { startLoading, stopLoading, isLoading: checkLoading } = useLoading();
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        startLoading('fetch-data', 'Loading data...');
        
        // Fetch user data
        console.log('🔄 Fetching user data...');
        const userResponse = await apiService.auth.getProfile();
        console.log('📡 User data response:', userResponse);
        
        if (userResponse.success) {
          setUserData(userResponse.data);
          console.log('✅ User data set:', userResponse.data);
        } else {
          console.error('❌ User data fetch failed:', userResponse.message);
          dispatch(showToast({
            message: userResponse.message || 'Failed to fetch user data',
            type: 'error'
          }));
        }
        
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
        const themesResponse = await apiService.themes.getByVoucherType('work_order');
        console.log('🎨 Work Order Themes response:', themesResponse);
        if (themesResponse.success) {
          console.log('✅ Work Order Themes data:', themesResponse.data);
          setThemes(themesResponse.data || []);
          // Set first theme as default if available
          if (themesResponse.data && themesResponse.data.length > 0) {
            setSelectedDesign(themesResponse.data[0].name);
          }
        } else {
          console.error('Failed to fetch themes:', themesResponse.message);
        }
      } catch (error) {
        console.error('\u274c Data fetch error:', error);
        console.error('\u274c Error details:', error.message);
        dispatch(showToast({
          message: `Failed to fetch data: ${error.message}`,
          type: 'error'
        }));
      } finally {
        stopLoading('fetch-data');
      }
    };
    fetchData();
  }, [dispatch, startLoading, stopLoading]);

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

    if (field === 'totalAmount') {
      // const fee = calculateFee('voucher_creation', parseFloat(value) || 0);
      // setVoucherFee(fee);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate user data
    if (!userData) {
      dispatch(showToast({
        message: 'User data not loaded. Please refresh the page.',
        type: 'error'
      }));
      return;
    }

    // Check if client email is provided and not the same as user's email
    if (!formData.clientEmail) {
      dispatch(showToast({
        message: 'Client email is required',
        type: 'error'
      }));
      return;
    }

    if (userData.email && formData.clientEmail.toLowerCase() === userData.email.toLowerCase()) {
      dispatch(showToast({
        message: 'You cannot create a work order voucher for yourself. Please use a different client email.',
        type: 'error'
      }));
      return;
    }
    
    const amount = parseFloat(formData.totalAmount) || 0;
    const fee = calculateFee('voucher_creation', amount);
    const totalWithFee = calculateTotal();
    if (userBalance < totalWithFee) {
      dispatch(showToast({
        message: `Insufficient balance. You need ₦${totalWithFee.toLocaleString()} (including ₦${fee.toLocaleString()} fee) but have ₦${userBalance.toLocaleString()}`,
        type: 'error'
      }));
      return;
    }
    try {
      startLoading('create-work-order', 'Creating work order...');
      // Validate milestones if payment type is milestone
      if (formData.paymentType === 'milestone') {
        const totalPercentage = formData.milestones.reduce((sum, milestone) => {
          return sum + (parseFloat(milestone.percentage) || 0);
        }, 0);
        
        if (totalPercentage > 100) {
          dispatch(showToast({
            message: `Total milestone percentage cannot exceed 100%. Current total: ${totalPercentage.toFixed(1)}%`,
            type: 'error'
          }));
          stopLoading('create-work-order');
          return;
        }
        
        if (totalPercentage < 100) {
          dispatch(showToast({
            message: `Total milestone percentage must equal 100%. Current total: ${totalPercentage.toFixed(1)}% (${(100 - totalPercentage).toFixed(1)}% remaining)`,
            type: 'error'
          }));
          stopLoading('create-work-order');
          return;
        }
      }

      const voucherData = {
        projectTitle: formData.projectTitle,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        totalAmount: parseFloat(formData.totalAmount),
        paymentType: formData.paymentType,
        description: formData.description,
        dueDate: formData.dueDate,
        terms: formData.terms,
        milestones: formData.paymentType === 'milestone' ? formData.milestones : undefined,
        theme: selectedDesign
      };

      const response = await apiService.vouchers.createWorkOrder(voucherData);
      
      if (response.success) {
        dispatch(showToast({
          message: 'Work order voucher created successfully!',
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
      stopLoading('create-work-order');
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
                                    ₦{calculateMilestoneAmount(milestone.percentage).toFixed(2)}
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
                              ₦{calculateTotal().toFixed(2)}
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
                    disabled={checkLoading('create-work-order')}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {checkLoading('create-work-order') ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Work Order Voucher...</span>
                      </>
                    ) : (
                      <>
                        <Handshake className="w-5 h-5" />
                        <span>Create Work Order Voucher</span>
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
                <h2 className="text-xl font-bold text-neutral-900 mb-4">Voucher Design</h2>
                {checkLoading('fetch-data') ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
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
                            ? 'border-primary-600 bg-primary-50'
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

                {/* Dynamic Voucher Preview */}
                {(() => {
                  const selectedThemeData = themes && themes.length > 0 ? themes.find(t => t.name === selectedDesign) : null;
                  
                  if (!selectedThemeData) {
                    return (
                      <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
                        <div className="text-center py-8">
                          <p className="text-neutral-600">No theme selected</p>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className={`border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br ${selectedThemeData.gradient_colors} text-white`}>
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <div className="text-white text-2xl">
                            {selectedThemeData.icon_emoji}
                          </div>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Work Order Voucher</h3>
                        <p className="text-white/80">CredoSafe Secure Transaction</p>
                      </div>

                      <div className="space-y-4">
                        {/* Project Details */}
                        <div className="bg-white/20 rounded-lg p-4">
                          <h4 className="font-semibold mb-2">Project Details</h4>
                          <p className="font-medium">{formData.projectTitle || 'Project Title'}</p>
                          <p className="text-sm text-white/80 mt-1">{formData.description || 'Project description'}</p>
                        </div>

                        {/* Client and Amount */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-white/80 mb-1">Client</p>
                            <p className="font-medium">{formData.clientName || 'Client Name'}</p>
                          </div>
                          <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-white/80 mb-1">Total Amount</p>
                            <p className="text-3xl font-bold">₦{calculateTotal().toFixed(2)}</p>
                          </div>
                        </div>

                        {/* Milestones */}
                        {formData.paymentType === 'milestone' && formData.milestones.length > 0 && (
                          <div className="bg-white/20 rounded-lg p-4">
                            <h4 className="font-semibold mb-3">Payment Milestones</h4>
                            <div className="space-y-2">
                              {formData.milestones.map((milestone, index) => (
                                <div key={index} className="flex justify-between items-center">
                                  <div>
                                    <p className="font-medium">{milestone.name || `Milestone ${index + 1}`}</p>
                                    <p className="text-sm text-white/80">{milestone.percentage || '0'}%</p>
                                  </div>
                                  <span className="font-bold">₦{calculateMilestoneAmount(milestone.percentage).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Payment Type */}
                        <div className="bg-white/20 rounded-lg p-4">
                          <p className="text-white/80 mb-1">Payment Type</p>
                          <p className="font-medium capitalize">{formData.paymentType || 'Full Payment'}</p>
                        </div>

                        {/* Due Date */}
                        {formData.dueDate && (
                          <div className="bg-white/20 rounded-lg p-4">
                            <p className="text-white/80 mb-1">Due Date</p>
                            <p className="font-medium">{new Date(formData.dueDate).toLocaleDateString()}</p>
                          </div>
                        )}

                        {/* Footer */}
                        <div className="border-t border-white/20 pt-4">
                          <p className="text-xs text-white/60">Voucher ID: WO-{Date.now().toString().slice(-8)}</p>
                          <p className="text-xs text-white/60">Created: {new Date().toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
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