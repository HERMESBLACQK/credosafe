import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Shield, 
  ArrowLeft,
  Crown,
  CheckCircle,
  X,
  Upload,
  Phone,
  Calendar,
  FileText,
  Star,
  Zap,
  Building,
  Users,
  CreditCard,
  Shield as SecurityIcon,
  Loader
} from 'lucide-react';
import apiService from '../api/index';
import { showToast } from '../store/slices/uiSlice';
import FloatingFooter from '../components/FloatingFooter';
import { useSelector } from 'react-redux';
import { useError } from '../contexts/ErrorContext';

const Tier = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [selectedTier, setSelectedTier] = useState(null);
  const [upgradeForm, setUpgradeForm] = useState({
    nin: '',
    bvn: '',
    dob: '',
    phone: '',
    addressProof: null,
    businessRegNumber: '',
    cacCertificate: null
  });
  const [otp, setOtp] = useState('');
  const [currentTier, setCurrentTier] = useState(1);
  const [fetchingTier, setFetchingTier] = useState(true);
  const [upgrading, setUpgrading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const tiers = [
    {
      id: 1,
      name: 'Basic',
      description: 'Essential features for new users',
      limits: {
        dailyLimit: 1000000, // 10x max voucher
        monthlyWithdrawal: 500000,
        maxVoucherAmount: 100000,
        dailyWithdrawal: 50000
      },
      features: [
        'Basic voucher creation',
        'Standard support',
        'Email notifications',
        'Basic security features'
      ],
      price: 'Free',
      color: 'from-neutral-500 to-neutral-600',
      icon: <Star className="w-6 h-6 text-white" />
    },
    {
      id: 2,
      name: 'Premium',
      description: 'Enhanced limits and features',
      limits: {
        dailyLimit: 10000000, // 10x max voucher
        monthlyWithdrawal: 10000000,
        maxVoucherAmount: 1000000,
        dailyWithdrawal: 500000
      },
      features: [
        'Higher transaction limits',
        'Priority support',
        'Advanced security',
        'Phone verification',
        'Enhanced voucher features',
        'Faster processing'
      ],
      price: 'Free',
      color: 'from-blue-500 to-blue-600',
      icon: <Zap className="w-6 h-6 text-white" />,
      requirements: ['NIN or BVN', 'Date of Birth', 'Registered Phone Number']
    },
    {
      id: 3,
      name: 'Advanced Premium',
      description: 'Advanced features for power users',
      limits: {
        dailyLimit: 250000000, // 10x max voucher
        monthlyWithdrawal: 25000000,
        maxVoucherAmount: 25000000,
        dailyWithdrawal: 5000000
      },
      features: [
        'Advanced transaction limits',
        'Priority support',
        'Advanced security',
        'Proof of address verification',
        'Enhanced voucher features',
        'Faster processing',
        'Dedicated support'
      ],
      price: 'Free',
      color: 'from-purple-500 to-purple-600',
      icon: <Crown className="w-6 h-6 text-white" />,
      requirements: ['Proof of Address']
    },
    {
      id: 4,
      name: 'Business',
      description: 'Professional features for businesses',
      limits: {
        dailyLimit: 2000000000, // 10x max voucher (unlimited voucher = 200M daily limit)
        monthlyWithdrawal: 50000000,
        maxVoucherAmount: 200000000, // Unlimited (set high limit)
        dailyWithdrawal: 20000000
      },
      features: [
        'Unlimited voucher amounts',
        'Business support',
        'API access',
        'Custom branding',
        'Business registration',
        'Multi-user accounts',
        'Advanced analytics',
        'Dedicated account manager'
      ],
      price: 'Free',
      color: 'from-indigo-500 to-indigo-600',
      icon: <Building className="w-6 h-6 text-white" />,
      requirements: ['Business Registration Number', 'CAC Certificate']
    }
  ];

  // Fetch current tier on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchCurrentTier();
    } else {
      setFetchingTier(false);
      dispatch(showToast({
        message: 'Please log in to view tier information',
        type: 'error'
      }));
      navigate('/login');
    }
  }, [isAuthenticated, navigate, dispatch]);

  const fetchCurrentTier = async () => {
    try {
      const response = await apiService.auth.getTier();
      if (response.success) {
        setCurrentTier(response.data.tier.level);
      } else {
        if (response.status === 401 || response.status === 403) {
          alert('Session expired or not authorized. Please log in again.');
          window.location.href = '/signin';
          return;
        } else {
          setCurrentTier(1);
        }
      }
    } catch (error) {
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        alert('Session expired or not authorized. Please log in again.');
        window.location.href = '/signin';
        return;
      } else {
        setCurrentTier(1);
      }
    } finally {
      setFetchingTier(false);
    }
  };

  const handleUpgradeClick = (tier) => {
    if (tier.id > currentTier) {
      setSelectedTier(tier);
    }
  };

  const handleUpgradeSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTier) return;

    try {
      setUpgrading(true);

      // Prepare documents object based on tier
      let documents = {};
      
      if (selectedTier.id === 2) {
        documents = {
          nin: upgradeForm.nin || upgradeForm.bvn,
          dob: upgradeForm.dob,
          phone: upgradeForm.phone
        };
      } else if (selectedTier.id === 3) {
        documents = {
          addressProof: upgradeForm.addressProof
        };
      } else if (selectedTier.id === 4) {
        documents = {
          businessRegNumber: upgradeForm.businessRegNumber,
          cacCertificate: upgradeForm.cacCertificate
        };
      }

      const response = await apiService.auth.upgradeTier({
        targetTier: selectedTier.id,
        documents: documents
      });

      if (response.success) {
        setCurrentTier(selectedTier.id);
        setSelectedTier(null);
        setUpgradeForm({
          nin: '',
          bvn: '',
          dob: '',
          phone: '',
          addressProof: null,
          businessRegNumber: '',
          cacCertificate: null
        });
        
        dispatch(showToast({
          message: `Successfully upgraded to ${selectedTier.name} tier!`,
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: response.error || 'Failed to upgrade tier',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('Error upgrading tier:', error);
      dispatch(showToast({
        message: 'Failed to upgrade tier',
        type: 'error'
      }));
    } finally {
      setUpgrading(false);
    }
  };

  const handleOTPSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      console.log('OTP verified, upgrading to tier 2');
      setCurrentTier(2);
      setShowOTPModal(false);
      setOtp('');
      setSelectedTier(null);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUpgradeForm(prev => ({
        ...prev,
        [type]: file
      }));
    }
  };



  if (fetchingTier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading tier information...</p>
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
              onClick={() => navigate('/settings')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Settings</span>
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
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Account Tiers</h1>
            <p className="text-neutral-600">Choose the perfect tier for your needs</p>
          </div>

          {/* Current Tier Display */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Your Current Tier</h2>
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-r ${tiers[currentTier - 1].color} rounded-xl flex items-center justify-center`}>
                  {tiers[currentTier - 1].icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-2xl font-bold text-neutral-900">{tiers[currentTier - 1].name}</h3>
                    <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">Active</span>
                  </div>
                  <p className="text-neutral-600 mb-3">{tiers[currentTier - 1].description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-neutral-500">Daily Limit:</span>
                      <p className="font-semibold text-neutral-900">₦{tiers[currentTier - 1].limits.dailyLimit.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Monthly Withdrawal:</span>
                      <p className="font-semibold text-neutral-900">₦{tiers[currentTier - 1].limits.monthlyWithdrawal.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Max Voucher:</span>
                      <p className="font-semibold text-neutral-900">₦{tiers[currentTier - 1].limits.maxVoucherAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-neutral-500">Daily Withdrawal:</span>
                      <p className="font-semibold text-neutral-900">₦{tiers[currentTier - 1].limits.dailyWithdrawal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Tiers */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Available Tiers</h2>
            <div className="grid gap-6">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border-2 rounded-2xl p-6 transition-all ${
                    tier.id === currentTier
                      ? 'border-green-500 bg-green-50'
                      : tier.id > currentTier
                      ? 'border-neutral-300 hover:border-primary-500 hover:shadow-medium cursor-pointer'
                      : 'border-neutral-200 bg-neutral-50 opacity-60'
                  }`}
                  onClick={() => handleUpgradeClick(tier)}
                >
                  <div className="flex items-start justify-between relative">
                                         <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 w-full">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r ${tier.color} rounded-xl flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}>
                        {tier.icon}
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-3">
                          <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">{tier.name}</h3>
                          {tier.id === currentTier && (
                            <span className="bg-green-100 text-green-800 text-xs sm:text-sm px-2 sm:px-3 py-1 rounded-full font-medium self-start sm:self-auto">Current</span>
                          )}
                          <span className="text-xl sm:text-2xl font-bold text-neutral-900">{tier.price}</span>
                        </div>
                        <p className="text-neutral-600 mb-4 text-sm sm:text-lg">{tier.description}</p>
                        
                        {/* Limits */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4">
                          <div className="bg-white rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-neutral-500 mb-1">Daily Limit</p>
                            <p className="font-semibold text-neutral-900 text-xs sm:text-sm">₦{tier.limits.dailyLimit.toLocaleString()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-neutral-500 mb-1">Monthly Withdrawal</p>
                            <p className="font-semibold text-neutral-900 text-xs sm:text-sm">₦{tier.limits.monthlyWithdrawal.toLocaleString()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-neutral-500 mb-1">Max Voucher</p>
                            <p className="font-semibold text-neutral-900 text-xs sm:text-sm">₦{tier.limits.maxVoucherAmount.toLocaleString()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-2 sm:p-3">
                            <p className="text-xs text-neutral-500 mb-1">Daily Withdrawal</p>
                            <p className="font-semibold text-neutral-900 text-xs sm:text-sm">₦{tier.limits.dailyWithdrawal.toLocaleString()}</p>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-neutral-900 mb-2 text-sm sm:text-base">Features:</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {tier.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                                <span className="text-xs sm:text-sm text-neutral-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Requirements for upgrade */}
                        {tier.id > currentTier && tier.requirements && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                            <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Requirements for Upgrade:</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {tier.requirements.map((req, reqIndex) => (
                                <div key={reqIndex} className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  <span className="text-xs sm:text-sm text-blue-700">{req}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {tier.id > currentTier && (
                      <div className="absolute top-4 right-4">
                        <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                          Upgrade
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Upgrade Form */}
          {selectedTier && selectedTier.id > currentTier && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft p-6 border-2 border-primary-200"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedTier.color} rounded-lg flex items-center justify-center`}>
                  {selectedTier.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">
                    Upgrade to {selectedTier.name}
                  </h3>
                  <p className="text-neutral-600">Complete the form below to upgrade your account</p>
                </div>
              </div>
              
                             <form onSubmit={handleUpgradeSubmit} className="space-y-6">
                 {selectedTier.id === 2 && (
                   <>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className="block text-sm font-medium text-neutral-700 mb-2">
                           NIN or BVN *
                         </label>
                         <input
                           type="text"
                           value={upgradeForm.nin}
                           onChange={(e) => setUpgradeForm(prev => ({ ...prev, nin: e.target.value }))}
                           className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           placeholder="Enter NIN or BVN"
                           required
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-neutral-700 mb-2">
                           Date of Birth *
                         </label>
                         <input
                           type="date"
                           value={upgradeForm.dob}
                           onChange={(e) => setUpgradeForm(prev => ({ ...prev, dob: e.target.value }))}
                           className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                           required
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-700 mb-2">
                         Registered Phone Number *
                       </label>
                       <input
                         type="tel"
                         value={upgradeForm.phone}
                         onChange={(e) => setUpgradeForm(prev => ({ ...prev, phone: e.target.value }))}
                         className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="+234 801 234 5678"
                         required
                       />
                     </div>
                   </>
                 )}

                 {selectedTier.id === 3 && (
                   <div>
                     <label className="block text-sm font-medium text-neutral-700 mb-2">
                       Proof of Address *
                     </label>
                     <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                       <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                       <p className="text-sm text-neutral-600 mb-2">
                         Upload utility bill, bank statement, or government ID
                       </p>
                       <input
                         type="file"
                         onChange={(e) => handleFileUpload(e, 'addressProof')}
                         accept=".pdf,.jpg,.jpeg,.png"
                         className="hidden"
                         id="address-proof"
                         required
                       />
                       <label
                         htmlFor="address-proof"
                         className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                       >
                         Choose File
                       </label>
                       {upgradeForm.addressProof && (
                         <p className="text-sm text-green-600 mt-2">
                           ✓ {upgradeForm.addressProof.name}
                         </p>
                       )}
                     </div>
                   </div>
                 )}

                 {selectedTier.id === 4 && (
                   <>
                     <div>
                       <label className="block text-sm font-medium text-neutral-700 mb-2">
                         Business Registration Number *
                       </label>
                       <input
                         type="text"
                         value={upgradeForm.businessRegNumber}
                         onChange={(e) => setUpgradeForm(prev => ({ ...prev, businessRegNumber: e.target.value }))}
                         className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                         placeholder="Enter business registration number"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-neutral-700 mb-2">
                         CAC Certificate *
                       </label>
                       <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                         <Upload className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                         <p className="text-sm text-neutral-600 mb-2">
                           Upload your CAC certificate or business registration document
                         </p>
                         <input
                           type="file"
                           onChange={(e) => handleFileUpload(e, 'cacCertificate')}
                           accept=".pdf,.jpg,.jpeg,.png"
                           className="hidden"
                           id="cac-certificate"
                           required
                         />
                         <label
                           htmlFor="cac-certificate"
                           className="inline-block px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors cursor-pointer"
                         >
                           Choose File
                         </label>
                         {upgradeForm.cacCertificate && (
                           <p className="text-sm text-green-600 mt-2">
                             ✓ {upgradeForm.cacCertificate.name}
                           </p>
                         )}
                       </div>
                     </div>
                   </>
                 )}

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedTier(null)}
                    disabled={upgrading}
                    className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={upgrading}
                    className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {upgrading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Upgrading...</span>
                      </>
                    ) : (
                      <span>Proceed</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-large max-w-md w-full p-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Verify OTP</h2>
              <p className="text-neutral-600 mb-6">
                Enter the 6-digit code sent to your registered phone number
              </p>
              
              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full px-4 py-3 text-center text-2xl font-mono border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowOTPModal(false)}
                    className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Verify
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Tier; 