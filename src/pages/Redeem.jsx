import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  ArrowLeft,
  Search,
  QrCode,
  Camera,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const Redeem = () => {
  const navigate = useNavigate();
  const [redeemMethod, setRedeemMethod] = useState('code');
  const [voucherCode, setVoucherCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsRedeeming(true);
    // Simulate redemption process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRedeeming(false);
    
    // Show success message and reset
    setVoucherCode('');
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
      
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Redeem Voucher</h1>
            <p className="text-neutral-600">Enter your voucher code or scan QR code to redeem</p>
          </div>

          {/* Redeem Method Tabs */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex space-x-1 mb-6">
              <button
                onClick={() => setRedeemMethod('code')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'code'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Enter Code</span>
                </div>
              </button>
              <button
                onClick={() => setRedeemMethod('qr')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'qr'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <QrCode className="w-5 h-5" />
                  <span>Scan QR</span>
                </div>
              </button>
            </div>

            {redeemMethod === 'code' ? (
              <form onSubmit={handleRedeem} className="space-y-6">
                <div>
                  <label htmlFor="voucherCode" className="block text-sm font-medium text-neutral-700 mb-2">
                    Voucher Code
                  </label>
                  <input
                    id="voucherCode"
                    type="text"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Enter your voucher code"
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isRedeeming || !voucherCode.trim()}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isRedeeming ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Redeeming...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Redeem Voucher</span>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <div className="w-32 h-32 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-16 h-16 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">QR Code Scanner</h3>
                <p className="text-neutral-600 mb-6">
                  Point your camera at the voucher QR code to redeem automatically
                </p>
                <button className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                  Open Camera
                </button>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How to Redeem</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Enter the voucher code provided by the sender</li>
                  <li>• Or scan the QR code if available</li>
                  <li>• Funds will be added to your wallet instantly</li>
                  <li>• You can use the funds for any CredoSafe transactions</li>
                </ul>
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

export default Redeem; 