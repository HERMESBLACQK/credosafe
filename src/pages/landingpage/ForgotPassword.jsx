import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Key, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import apiService from '../../api/index';
import { useError } from '../../contexts/ErrorContext';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { showError, clearError } = useError();
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!email.trim()) {
      showError('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.auth.requestPasswordReset({ email });
      if (response.success) {
        setStep(2);
      } else {
        showError(response.message || 'Failed to send OTP. Try again.');
      }
    } catch (error) {
      showError(error.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!otp.trim()) {
      showError('Please enter the OTP sent to your email.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.auth.verifyPasswordResetOtp({ email, otp });
      if (response.success) {
        setStep(3);
      } else {
        showError(response.message || 'OTP verification failed.');
      }
    } catch (error) {
      showError(error.message || 'OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    clearError();
    if (!newPassword || !confirmPassword) {
      showError('Please enter and confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      showError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.auth.resetPassword({ email, otp, newPassword, confirmPassword });
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        showError(response.message || 'Failed to reset password.');
      }
    } catch (error) {
      showError(error.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
      <motion.div
        className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button className="mb-4 flex items-center text-primary-600 hover:underline" onClick={() => navigate('/signin')}>
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Sign In
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center text-primary-700">Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">Email Address</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Mail className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  type="email"
                  className="flex-1 outline-none bg-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">Enter OTP</label>
              <div className="flex items-center border rounded-lg px-3 py-2">
                <Key className="w-5 h-5 text-neutral-400 mr-2" />
                <input
                  type="text"
                  className="flex-1 outline-none bg-transparent"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">New Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-neutral-700">Confirm Password</label>
              <input
                type="password"
                className="w-full border rounded-lg px-3 py-2 outline-none"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <button type="submit" className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {success && (
          <div className="flex flex-col items-center mt-6">
            <CheckCircle className="w-10 h-10 text-green-500 mb-2" />
            <span className="text-green-700 font-semibold">Password reset successful! Redirecting...</span>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
