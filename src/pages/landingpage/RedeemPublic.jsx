import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../../api/index';
import { 
  Shield, 
  CreditCard, 
  ArrowLeft,
  Search,
  QrCode,
  Camera,
  CheckCircle,
  AlertCircle,
  Upload,
  FileText
} from 'lucide-react';

import ErrorMessage from '../../components/ErrorMessage';
import { useError } from '../../contexts/ErrorContext';
import { useLoading } from '../../contexts/LoadingContext';
import QRCodeScanner from '../../components/QRCodeScanner';

const Redeem = () => {
  const navigate = useNavigate();
  const [redeemMethod, setRedeemMethod] = useState('code');
  const [voucherCode, setVoucherCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { error, showError, clearError } = useError();
  const { startLoading, stopLoading } = useLoading();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    clearError();
    setIsProcessing(true);
    startLoading('redeem-code', 'Searching for voucher...');
    try {
      const response = await apiService.publicVouchers.searchByCode(voucherCode);
      if (response.success && response.data) {
        navigate('/landingpage/redeem-voucher-public', { 
          state: { 
            voucherData: response.data,
            method: 'code',
            voucherCode: voucherCode
          } 
        });
      } else {
        showError(response.message || 'Voucher not found. Please check the code and try again.');
      }
    } catch (error) {
      // Show server error message if available
      const serverMsg = error?.response?.data?.message || error.message;
      showError(serverMsg || 'Error searching for voucher. Please try again.');
    } finally {
      setIsProcessing(false);
      stopLoading('redeem-code');
    }
  };

  const handleQRScan = () => {
    setShowQRScanner(true);
  };

  const handleQRCodeScanned = async (scannedCode) => {
    setShowQRScanner(false);
    clearError();
    setIsProcessing(true);
    startLoading('redeem-qr', 'Processing scanned QR code...');
    try {
      const response = await apiService.publicVouchers.searchByCode(scannedCode);
      if (response.success && response.data) {
        navigate('/landingpage/redeem-voucher-public', { 
          state: { 
            voucherData: response.data,
            method: 'qr',
            voucherCode: scannedCode
          } 
        });
      } else {
        showError(response.message || 'Voucher not found. Please check the QR code and try again.');
      }
    } catch (error) {
      // Show server error message if available
      const serverMsg = error?.response?.data?.message || error.message;
      showError(serverMsg || 'Error processing QR scan. Please try again.');
    } finally {
      setIsProcessing(false);
      stopLoading('redeem-qr');
    }
  };

  const handleQRScannerError = (error) => {
    setShowQRScanner(false);
  };

  const handleQRScannerClose = () => {
    setShowQRScanner(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
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
            <p className="text-neutral-600">Enter code, scan QR, or upload voucher to redeem</p>
          </div>

          {/* Redeem Method Tabs */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => setRedeemMethod('code')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'code'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Search className="w-5 h-5" />
                  <span className="text-xs">Code</span>
                </div>
              </button>
              <button
                onClick={() => setRedeemMethod('qr')}
                className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'qr'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <QrCode className="w-5 h-5" />
                  <span className="text-xs">Scan QR</span>
                </div>
              </button>
            </div>

            {redeemMethod === 'code' && (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
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
                  disabled={isProcessing || !voucherCode.trim()}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Verify Voucher</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {redeemMethod === 'qr' && (
              <div className="text-center py-8">
                <div className="w-32 h-32 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-16 h-16 text-neutral-400" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">QR Code Scanner</h3>
                <p className="text-neutral-600 mb-6">
                  Point your camera at the voucher QR code to scan and verify
                </p>
                <button 
                  onClick={handleQRScan}
                  disabled={isProcessing}
                  className="bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      <span>Open Camera</span>
                    </>
                  )}
                </button>
              </div>
            )}

          </div>

          {/* Error Message */}
          {/* Error display is now global via ErrorContext */}

          {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How to Redeem</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Enter the voucher code provided by the sender</li>
                <li>• Or scan the QR code if available</li>
                <li>• Verify voucher details on the preview page</li>
                <li>• Choose withdrawal method (wallet or bank)</li>
                <li>• Complete the redemption process</li>
                <li>• Note: You cannot redeem vouchers you created</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    {/* Floating Footer Navigation */}
    
    {/* QR Code Scanner Modal */}
    {showQRScanner && (
      <QRCodeScanner
        onScan={handleQRCodeScanned}
        onClose={handleQRScannerClose}
        onError={handleQRScannerError}
      />
    )}
  </div>
  );
};

export default Redeem;
