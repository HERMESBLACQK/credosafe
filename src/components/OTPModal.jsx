import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';

const OTPModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  onResend, 
  email, 
  loading = false,
  error = null 
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef([]);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Handle countdown for resend button
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isOpen]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').replace(/\D/g, '');
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('').slice(0, 6);
      setOtp(newOtp);
      setActiveIndex(5);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify(otpString);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend(email);
      setResendCountdown(60); // 60 seconds countdown
      setResendDisabled(true);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const resetOTP = () => {
    setOtp(['', '', '', '', '', '']);
    setActiveIndex(0);
    setResendCountdown(0);
    setResendDisabled(false);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-4 sm:p-6"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                Verify Your Email
              </h3>
              <p className="text-sm sm:text-base text-neutral-600">
                We've sent a 6-digit code to
              </p>
              <p className="text-sm sm:text-base text-primary-600 font-semibold">
                {email}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            {/* OTP Input */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Enter 6-digit code
              </label>
              <div className="flex space-x-2 sm:space-x-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    onFocus={() => setActiveIndex(index)}
                    className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                      activeIndex === index
                        ? 'border-primary-500 bg-primary-50'
                        : digit
                        ? 'border-green-500 bg-green-50'
                        : 'border-neutral-300 hover:border-neutral-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={otp.join('').length !== 6 || loading}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-4"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify Code</span>
                </>
              )}
            </button>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-neutral-600 text-sm mb-2">
                Didn't receive the code?
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleResend}
                  disabled={resendDisabled || resendLoading}
                  className="text-primary-600 hover:text-primary-700 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {resendLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>
                        {resendDisabled 
                          ? `Resend in ${resendCountdown}s` 
                          : 'Resend Code'
                        }
                      </span>
                    </>
                  )}
                </button>
                <span className="text-neutral-400">|</span>
                <button
                  onClick={resetOTP}
                  className="text-neutral-600 hover:text-neutral-700 text-sm"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal; 