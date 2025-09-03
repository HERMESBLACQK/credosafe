import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle
} from 'lucide-react';
import { loginUser } from '../store/slices/authSlice';
import apiService from '../api/index';
import OTPModal from '../components/OTPModal';
import { useLoading } from '../contexts/LoadingContext';
import { showSuccess, showError, handleApiError } from '../utils/toast';

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { isLoading } = useSelector((state) => state.auth); // Remove unused variable

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: '' // Add referredBy field
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // OTP Modal state
  const [showOTPModal, setShowOTPModal] = useState(false);
  const { startLoading, stopLoading } = useLoading();
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      startLoading('signup', 'Creating your account...');
      // Prepare user data for registration
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        referred_by: formData.referredBy?.trim() || undefined
      };

      // Call registration API
      const result = await apiService.auth.register(payload);
      
      if (result?.success) {
        console.log('📝 Registration response:', result);
        console.log('🎫 Token from registration:', result.data?.token);
        
        // Store the temporary token from registration
        const token = result.data?.token;
        if (token) {
          apiService.setAuthToken(token);
          console.log('✅ Temporary token stored after registration');
        } else {
          console.log('❌ No token received from registration');
        }
        
        // Show OTP modal
        setShowOTPModal(true);
        setOtpError(null);
        
        console.log('🔐 OTP Modal State:', { showOTPModal: true, email: formData.email });
      } else {
        console.error('Registration failed:', result?.error);
      }
    } catch (error) {
      console.error('Registration error:', error);
      handleApiError(error, 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      stopLoading('signup');
    }
  };

  // Handle OTP verification
  const handleOTPVerify = async (otp) => {
    setOtpLoading(true);
    setOtpError(null);

    try {
      const result = await apiService.auth.verifyOTP({
        email: formData.email,
        otp: otp
      });

      if (result.success) {
        console.log('📝 OTP verification response:', result);
        console.log('🎫 Token from OTP verification:', result.data?.token);
        
        // Store the final token after email verification
        const token = result.data?.token;
        if (token) {
          apiService.setAuthToken(token);
          console.log('✅ Final token stored after email verification');
        } else {
          console.log('❌ No token received from OTP verification');
        }
        
        // Auto-login the user
        dispatch(loginUser({ 
          user: result.data?.user,
          token: token
        }));
        
        showSuccess('Email verified successfully! Welcome to CredoSafe.');
        
        setShowOTPModal(false);
        navigate('/dashboard');
      } else {
        setOtpError(result.error || result.message || 'Invalid OTP. Please try again.');
        showError(result.error || result.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      setOtpError('Verification failed. Please try again.');
      handleApiError(error, 'Verification failed. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP resend
  const handleOTPResend = async (email) => {
    try {
      const response = await apiService.auth.resendOTP(email);
      
      if (response.success) {
        showSuccess('New OTP sent to your email!');
      } else {
        showError(response.error || 'Failed to resend OTP.');
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      handleApiError(error, 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </div>
       
          </div>
        </div>
      </nav>

      {/* Sign Up Form */}
      <div className="flex items-center justify-center py-8 sm:py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">
              Create Account
            </h2>
            <p className="text-neutral-600">
              Join CredoSafe and start creating secure vouchers
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.firstName ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.lastName ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>

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
                />
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="Confirm your password"
                />
                <Lock className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Referral Code */}
            <div className="mb-4">
              <label htmlFor="referredBy" className="block text-sm font-medium text-neutral-700 mb-2">
                Referral Code (optional)
              </label>
              <input
                id="referredBy"
                name="referredBy"
                type="text"
                value={formData.referredBy}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.referredBy ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter referral code if you have one"
              />
              {errors.referredBy && (
                <p className="mt-1 text-sm text-red-600">{errors.referredBy}</p>
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
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleOTPVerify}
        onResend={handleOTPResend}
        email={formData.email}
        loading={otpLoading}
        error={otpError}
      />
    </div>
  );
};

export default SignUp; 