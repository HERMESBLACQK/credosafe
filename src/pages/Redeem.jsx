import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import apiService from '../api/index';
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
import { useLoading } from '../contexts/LoadingContext';
import QRCodeScanner from '../components/QRCodeScanner';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';

const Redeem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [redeemMethod, setRedeemMethod] = useState('code');
  const [voucherCode, setVoucherCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const { startLoading, stopLoading } = useLoading();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    setIsProcessing(true);
    startLoading('redeem-code', 'Searching for voucher...');
    try {
      console.log('🔍 Searching for voucher with code:', voucherCode);
      const response = await apiService.vouchers.searchByCode(voucherCode);
      
      console.log('📡 Server response for voucher search:', response);
      console.log('📡 Response success:', response.success);
      console.log('📡 Response message:', response.message);
      console.log('📡 Response data:', response.data);
      console.log('📡 Response data type:', typeof response.data);
      console.log('📡 Response data keys:', response.data ? Object.keys(response.data) : 'No data');
      console.log('📡 Voucher ID:', response.data?.id);
      
      if (response.success && response.data) {
        console.log('✅ Voucher found:', response.data);
        console.log('🔍 Navigating to:', `/redeem-voucher/${response.data.id}`);
        console.log('🔍 Navigation state:', { 
          voucherData: response.data,
          method: 'code',
          voucherCode: voucherCode
        });
        // Try navigation with ID first, fallback to without ID
        const targetPath = response.data.id ? `/redeem-voucher/${response.data.id}` : '/redeem-voucher';
        console.log('🔍 Final navigation path:', targetPath);
        navigate(targetPath, { 
          state: { 
            voucherData: response.data,
            method: 'code',
            voucherCode: voucherCode
          } 
        });
      } else {
        console.error('❌ Voucher not found or error:', response.message);
        dispatch(showToast({
          message: 'Voucher not found. Please check the code and try again.',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Error searching for voucher:', error);
      dispatch(showToast({
        message: 'Error searching for voucher. Please try again.',
        type: 'error'
      }));
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
    setIsProcessing(true);
    startLoading('redeem-qr', 'Processing scanned QR code...');
    
    try {
      console.log('🔍 QR Code scanned:', scannedCode);
      
      const response = await apiService.vouchers.searchByCode(scannedCode);
      
      console.log('📡 Server response for QR scan:', response);
      console.log('📡 Response success:', response.success);
      console.log('📡 Response message:', response.message);
      console.log('📡 Response data:', response.data);
      
      if (response.success && response.data) {
        console.log('✅ Voucher found from QR scan:', response.data);
        const targetPath = response.data.id ? `/redeem-voucher/${response.data.id}` : '/redeem-voucher';
        navigate(targetPath, { 
          state: { 
            voucherData: response.data,
            method: 'qr',
            voucherCode: scannedCode
          } 
        });
      } else {
        console.error('❌ Voucher not found from QR scan:', response.message);
        dispatch(showToast({
          message: 'Voucher not found. Please check the QR code and try again.',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Error processing QR scan:', error);
      dispatch(showToast({
        message: 'Error processing QR scan. Please try again.',
        type: 'error'
      }));
    } finally {
      setIsProcessing(false);
      stopLoading('redeem-qr');
    }
  };

  const handleQRScannerError = (error) => {
    console.error('QR Scanner error:', error);
    setShowQRScanner(false);
  };

  const handleQRScannerClose = () => {
    setShowQRScanner(false);
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">Redeem Voucher</h1>
            <p className="text-sm text-neutral-600">Enter code, scan QR, or upload voucher to redeem</p>
          </div>

          {/* Redeem Method Tabs */}
          <div className="bg-white rounded-xl shadow-soft p-4 sm:p-6 mb-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setRedeemMethod('code')}
                className={`py-2.5 px-3 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'code'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Search className="w-4 h-4" />
                  <span className="text-xs">Code</span>
                </div>
              </button>
              <button
                onClick={() => setRedeemMethod('qr')}
                className={`py-2.5 px-3 rounded-lg font-medium transition-colors ${
                  redeemMethod === 'qr'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <QrCode className="w-4 h-4" />
                  <span className="text-xs">Scan QR</span>
                </div>
              </button>
            </div>

            {redeemMethod === 'code' && (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
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
                    className="w-full px-4 py-2.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isProcessing || !voucherCode.trim()}
                  className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Camera className="w-10 h-10 text-neutral-400" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-2">QR Code Scanner</h3>
                <p className="text-sm text-neutral-600 mb-4">
                  Point your camera at the voucher QR code to scan and verify
                </p>
                <button 
                  onClick={handleQRScan}
                  disabled={isProcessing}
                  className="bg-primary-600 text-white py-2.5 px-5 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mx-auto text-sm"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      <span>Open Camera</span>
                    </>
                  )}
                </button>
              </div>
            )}


          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2 text-sm">How to Redeem</h3>
                <ul className="text-blue-800 space-y-1 text-xs">
                  <li>• Enter the voucher code provided by the sender</li>
                  <li>• Or scan the QR code if available</li>
                  <li>• Verify voucher details on the preview page</li>
                  <li>• Choose withdrawal method (wallet or bank)</li>
                  <li>• Complete the redemption process</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />

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