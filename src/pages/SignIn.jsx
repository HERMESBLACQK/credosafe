import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  LogIn
} from 'lucide-react';
import { storeLoginData } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import { useError } from '../contexts/ErrorContext';
import apiService from '../api/index';
import { useLoading } from '../contexts/LoadingContext';
import OTPModal from '../components/OTPModal'; // Added import for OTPModal

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const { startLoading, stopLoading, isLoading: checkLoading } = useLoading();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [loginData, setLoginData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmailVerificationModal, setShowEmailVerificationModal] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getDeviceInfo = (location = null) => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const screenResolution = `${screen.width}x${screen.height}`;
    
    // Detect device type
    let deviceType = 'desktop';
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/iPad|Android.*Tablet|Tablet/i.test(userAgent)) {
      deviceType = 'tablet';
    }
    
    // Detect browser
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // Detect OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    // Generate device name
    const deviceName = `${os} ${deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}`;
    
    const deviceInfo = {
      deviceName,
      deviceType,
      browser,
      os,
      screenResolution,
      timezone,
      language,
      platform,
      userAgent
    };
    if (location) {
      deviceInfo.location = location;
    }
    return deviceInfo;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (isSubmitting) return; // Prevent multiple submissions

    try {
      setIsSubmitting(true);
      startLoading('signin', 'Signing you in...');

      // Try to get device location
      const getLocation = () => {
        return new Promise((resolve) => {
          if (!navigator.geolocation) {
            resolve(null);
          } else {
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                resolve({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude
                });
              },
              (err) => {
                resolve(null);
              },
              { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
            );
          }
        });
      };

      const location = await getLocation();
      const deviceInfo = getDeviceInfo(location);

      // Call login API with device information
      const loginPayload = {
        ...formData,
        deviceInfo
      };

      const response = await apiService.auth.login(loginPayload);

      if (response.success) {
        if (response.data?.requiresOTP) {
          // User has 2FA enabled, show OTP modal
          setLoginData(response.data);
          setShowOTPModal(true);
          dispatch(showToast({ 
            message: 'Please check your email for the verification code', 
            type: 'info' 
          }));
        } else if (response.data?.emailNotVerified) {
          // User's email is not verified, show email verification modal
          setEmailForVerification(formData.email);
          setShowEmailVerificationModal(true);
          dispatch(showToast({ 
            message: 'Please verify your email address before signing in', 
            type: 'warning' 
          }));
        } else {
          // No 2FA required, proceed with login
          await completeLogin(response.data);
        }
      } else {
        dispatch(showToast({ 
          message: response.error || response.message || 'Login failed. Please try again.', 
          type: 'error' 
        }));
      }
    } catch (error) {
      console.error('Login error:', error);
      dispatch(showToast({ 
        message: 'Login failed. Please check your connection and try again.', 
        type: 'error' 
      }));
    } finally {
      setIsSubmitting(false);
      stopLoading('signin');
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      dispatch(showToast({ 
        message: 'Please enter the verification code', 
        type: 'error' 
      }));
      return;
    }

    try {
      startLoading('otp', 'Verifying code...');
      
      const response = await apiService.auth.verifyLoginOTP({
        email: formData.email,
        otp: otp.trim()
      });
      
      if (response.success) {
        await completeLogin(response.data);
      } else {
        dispatch(showToast({ 
          message: response.error || response.message || 'Invalid verification code', 
          type: 'error' 
        }));
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      dispatch(showToast({ 
        message: 'Verification failed. Please try again.', 
        type: 'error' 
      }));
    } finally {
      stopLoading('otp');
    }
  };

  const handleEmailVerificationOTP = async (otp) => {
    try {
      startLoading('email-verification', 'Verifying email...');
      
      const response = await apiService.auth.verifyOTP({
        email: emailForVerification,
        otp: otp
      });
      
      if (response.success) {
        setShowEmailVerificationModal(false);
        dispatch(showToast({ 
          message: 'Email verified successfully! You can now sign in.', 
          type: 'success' 
        }));
        // Clear the form and let user try login again
        setFormData({ email: '', password: '' });
      } else {
        dispatch(showToast({ 
          message: response.error || response.message || 'Invalid verification code', 
          type: 'error' 
        }));
      }
    } catch (error) {
      console.error('Email verification error:', error);
      dispatch(showToast({ 
        message: 'Email verification failed. Please try again.', 
        type: 'error' 
      }));
    } finally {
      stopLoading('email-verification');
    }
  };

  const handleEmailVerificationResend = async (email) => {
    try {
      const response = await apiService.auth.resendOTP(email);
      
      if (response.success) {
        dispatch(showToast({ 
          message: 'New verification code sent to your email!', 
          type: 'success' 
        }));
      } else {
        dispatch(showToast({ 
          message: response.error || 'Failed to resend verification code.', 
          type: 'error' 
        }));
      }
    } catch (error) {
      console.error('Email verification resend error:', error);
      dispatch(showToast({ 
        message: 'Failed to resend verification code. Please try again.', 
        type: 'error' 
      }));
    }
  };

  const completeLogin = async (data) => {
    const token = data?.token;
    const user = data?.user;
    
    if (token) {
      apiService.setAuthToken(token);
      console.log('✅ Login token stored successfully');
    } else {
      console.log('❌ No token received from login');
    }
    
    // Dispatch store login data action
    dispatch(storeLoginData({ 
      user: user,
      token: token
    }));
    
    dispatch(showToast({ 
      message: 'Welcome back to CredoSafe!', 
      type: 'success' 
    }));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
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
      </nav>

      {/* Sign In Form */}
      <div className="flex items-center justify-center py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-neutral-600">
              Sign in to your CredoSafe account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your email address"
                />
                <Mail className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-primary-600 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="text-right mt-1">
                <button
                  type="button"
                  className="text-primary-600 hover:underline text-sm font-medium"
                  onClick={() => navigate('/landingpage/forgot-password')}
                  tabIndex={0}
                >
                  Forgot password?
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">
                Two-Factor Authentication
              </h3>
              <p className="text-neutral-600">
                Enter the verification code sent to your email
              </p>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-neutral-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowOTPModal(false);
                    setOtp('');
                    setLoginData(null);
                  }}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={checkLoading('otp')}
                  className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {checkLoading('otp') ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <span>Verify</span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Email Verification Modal */}
      <OTPModal
        isOpen={showEmailVerificationModal}
        onClose={() => setShowEmailVerificationModal(false)}
        onVerify={handleEmailVerificationOTP}
        onResend={handleEmailVerificationResend}
        email={emailForVerification}
        loading={checkLoading('email-verification')}
        error={null}
        title="Email Verification Required"
        description="Please verify your email address before signing in. Enter the verification code sent to your email."
      />
    </div>
  );
};

export default SignIn; 