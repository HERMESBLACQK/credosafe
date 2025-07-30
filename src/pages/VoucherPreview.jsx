import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Share2
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const VoucherPreview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [withdrawalMethod, setWithdrawalMethod] = useState('wallet');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  // Mock voucher data based on the method used
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
    // Simulate fetching voucher data based on the method
    const method = location.state?.method || 'code';
    const code = location.state?.voucherCode || 'DEMO-CODE-123';
    
    // Mock voucher data
    const mockVoucherData = {
      id: 'VCH-001',
      code: code,
      type: 'Gift Card',
      amount: 50000,
      availableAmount: 50000,
      sender: 'John Doe',
      recipient: 'Jane Smith',
      issueDate: '2024-01-15T10:30:00Z',
      expiryDate: '2024-12-31T23:59:59Z',
      status: 'active',
      description: 'Birthday Gift Card',
      design: 'premium',
      isAnonymous: false,
      message: 'Happy Birthday! Enjoy your special day.',
      method: method
    };

    setVoucherData(mockVoucherData);
  }, [location.state]);

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

  const verifyAccount = async () => {
    if (withdrawForm.accountNumber && withdrawForm.bankName) {
      setIsVerifying(true);
      // Simulate API call
      setTimeout(() => {
        setWithdrawForm(prev => ({
          ...prev,
          accountName: 'Jane Smith'
        }));
        setIsVerified(true);
        setIsVerifying(false);
      }, 2000);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (withdrawalMethod === 'bank' && !isVerified) {
      return;
    }

    setIsRedeeming(true);
    // Simulate redemption process
    setTimeout(() => {
      setIsRedeeming(false);
      setShowWithdrawModal(false);
      setShowSuccessModal(true);
    }, 3000);
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

          {/* Voucher Details Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
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
                    <span className="text-sm opacity-90">Available Amount</span>
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Active</span>
                  </div>
                  <p className="text-3xl font-bold">{formatCurrency(voucherData.availableAmount)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Voucher Code:</span>
                    <span className="font-mono font-medium">{voucherData.code}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Type:</span>
                    <span className="font-medium">{voucherData.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Original Amount:</span>
                    <span className="font-medium">{formatCurrency(voucherData.amount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">From:</span>
                    <span className="font-medium">{voucherData.sender}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">To:</span>
                    <span className="font-medium">{voucherData.recipient}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Details */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Issue Date:</span>
                    <span className="font-medium">{formatDate(voucherData.issueDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Expiry Date:</span>
                    <span className="font-medium">{formatDate(voucherData.expiryDate)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Status:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                      {voucherData.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-600">Method:</span>
                    <span className="font-medium capitalize">{voucherData.method}</span>
                  </div>
                </div>

                {voucherData.message && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Message from Sender</h4>
                    <p className="text-neutral-700 italic">"{voucherData.message}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Withdrawal Options */}
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
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Redeem Voucher</span>
            </button>
          </div>

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
                    {formatCurrency(voucherData.availableAmount)} will be added to your CredoSafe wallet instantly.
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
                ? `${formatCurrency(voucherData.availableAmount)} has been added to your wallet.`
                : `${formatCurrency(voucherData.availableAmount)} will be transferred to your bank account within 1-3 business days.`
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

export default VoucherPreview; 