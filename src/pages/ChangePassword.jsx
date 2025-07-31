import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Shield, 
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Key
} from 'lucide-react';
import { apiService } from '../api';
import { showToast } from '../store/slices/uiSlice';
import OTPModal from '../components/OTPModal';
import FloatingFooter from '../components/FloatingFooter';

const ChangePassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.newPassword)) {
      newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async () => {
    try {
      setSendingOTP(true);
      const response = await apiService.auth.sendPasswordOTP();
      
      if (response.success) {
        setShowOTPModal(true);
        dispatch(showToast({
          message: 'OTP sent to your email',
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: response.error || 'Failed to send OTP',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      dispatch(showToast({
        message: 'Failed to send OTP',
        type: 'error'
      }));
    } finally {
      setSendingOTP(false);
    }
  };

  const handleOTPVerify = async (otpValue) => {
    try {
      setLoading(true);
      
      console.log('🔐 Verifying OTP:', otpValue);
      
      const response = await apiService.auth.verifyPasswordOTP(otpValue);
      
      console.log('📥 OTP verification response:', response);
      
      if (response.success) {
        setOtp(otpValue);
        setOtpVerified(true);
        setShowOTPModal(false);
        dispatch(showToast({
          message: 'OTP verified successfully',
          type: 'success'
        }));
      } else {
        dispatch(showToast({
          message: response.error || 'Invalid OTP',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ OTP verification error:', error);
      dispatch(showToast({
        message: 'Failed to verify OTP',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otpVerified) {
      dispatch(showToast({
        message: 'Please verify OTP first',
        type: 'error'
      }));
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const response = await apiService.auth.changePassword({
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      console.log('📥 Change password response:', response);
      
      if (response.success) {
      setSuccess(true);
      setFormData({
        newPassword: '',
        confirmPassword: ''
      });
        setOtp('');
        setOtpVerified(false);
        
        dispatch(showToast({
          message: 'Password changed successfully',
          type: 'success'
        }));
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
        navigate('/settings');
      }, 3000);
      } else {
        dispatch(showToast({
          message: response.error || 'Failed to change password',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Change password error:', error);
      dispatch(showToast({
        message: 'Failed to change password',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: 'bg-neutral-200', text: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const strengthMap = {
      1: { color: 'bg-red-500', text: 'Very Weak' },
      2: { color: 'bg-orange-500', text: 'Weak' },
      3: { color: 'bg-yellow-500', text: 'Fair' },
      4: { color: 'bg-blue-500', text: 'Good' },
      5: { color: 'bg-green-500', text: 'Strong' }
    };

    return { strength, ...strengthMap[strength] };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Change Password</h1>
            <p className="text-neutral-600">Update your account password for enhanced security</p>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">Password Changed Successfully!</h3>
                <p className="text-sm text-green-700">Redirecting to settings...</p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center space-x-3"
            >
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="font-medium text-red-900">Error</h3>
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </motion.div>
          )}

          {/* OTP Verification Status */}
          {otpVerified && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center space-x-3"
            >
              <CheckCircle className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">OTP Verified</h3>
                <p className="text-sm text-blue-700">You can now change your password</p>
              </div>
            </motion.div>
          )}

          {/* Password Change Form */}
          <div className="bg-white rounded-2xl shadow-soft p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Verification Section */}
              {!otpVerified && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <Key className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-medium text-yellow-900">OTP Verification Required</h3>
                  </div>
                  <p className="text-sm text-yellow-700 mb-4">
                    To change your password, you need to verify your identity with a one-time password sent to your email.
                  </p>
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={sendingOTP}
                    className="w-full bg-yellow-600 text-white py-3 px-4 rounded-lg hover:bg-yellow-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendingOTP ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <Key className="w-4 h-4" />
                        <span>Send OTP</span>
                      </>
                    )}
                  </button>
                </div>
                )}

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    disabled={!otpVerified}
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.newPassword ? 'border-red-300' : 'border-neutral-300'
                    } ${!otpVerified ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
                    placeholder="Enter your new password"
                  />
                  <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    disabled={!otpVerified}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 disabled:cursor-not-allowed"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                )}
                
                {/* Password Strength Indicator */}
                {formData.newPassword && otpVerified && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-600">Password Strength:</span>
                      <span className={`text-sm font-medium ${passwordStrength.color.replace('bg-', 'text-')}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    disabled={!otpVerified}
                    className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-neutral-300'
                    } ${!otpVerified ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
                    placeholder="Confirm your new password"
                  />
                  <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    disabled={!otpVerified}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 disabled:cursor-not-allowed"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Password Requirements */}
              {otpVerified && (
              <div className="bg-neutral-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-neutral-900 mb-2">Password Requirements:</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${formData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span>At least 8 characters long</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span>Contains lowercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span>Contains uppercase letter</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${/\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-neutral-300'}`} />
                    <span>Contains number</span>
                  </li>
                     <li className="flex items-center space-x-2">
                       <div className={`w-2 h-2 rounded-full ${/[@$!%*?&]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-neutral-300'}`} />
                       <span>Contains special character (@$!%*?&)</span>
                     </li>
                </ul>
              </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !otpVerified}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          onVerify={handleOTPVerify}
          onResend={handleSendOTP}
          email={user?.email}
          loading={loading}
          title="Verify Password Change"
          message="Enter the 6-digit code sent to your email to verify your identity"
        />
      )}
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default ChangePassword; 