import { showSuccess, showError, showWarning, showInfo, handleApiError, showLoadingToast } from './toast';

/**
 * Enhanced API Response Handler
 * Ensures all API responses are properly processed and user feedback is provided
 */

class APIResponseHandler {
  constructor() {
    this.loadingToasts = new Map();
  }

  /**
   * Handle API response with proper success/error messaging
   */
  handleResponse(response, options = {}) {
    const {
      successMessage,
      errorMessage,
      showSuccessToast = true,
      showErrorToast = true,
      loadingKey = null,
      customSuccessHandler = null,
      customErrorHandler = null
    } = options;

    console.log('🔍 APIResponseHandler.handleResponse called with:', response);

    // Dismiss loading toast if provided
    if (loadingKey && this.loadingToasts.has(loadingKey)) {
      this.loadingToasts.get(loadingKey)();
      this.loadingToasts.delete(loadingKey);
    }

    // Handle success response - check both response.data.success and response.success
    const isSuccess = response?.data?.success || response?.success || response?.status === 'success';
    if (isSuccess) {
      console.log('✅ Response is successful, processing...');
      if (customSuccessHandler) {
        customSuccessHandler(response);
      } else if (successMessage && showSuccessToast) {
        showSuccess(successMessage);
      }
      const result = { success: true, data: response.data?.data || response.data || response, response };
      console.log('🚀 Returning success result:', result);
      return result;
    }

    // Handle error response
    console.log('❌ Response is not successful, treating as error');
    const errorMsg = response?.data?.message || response?.message || errorMessage || 'An error occurred';
    if (customErrorHandler) {
      customErrorHandler(errorMsg, response);
    } else if (showErrorToast) {
      showError(errorMsg);
    }
    
    const result = { success: false, error: errorMsg, response };
    console.log('🚫 Returning error result:', result);
    return result;
  }

  /**
   * Handle API error with proper error messaging
   */
  handleError(error, options = {}) {
    const {
      errorMessage,
      showErrorToast = true,
      loadingKey = null,
      customErrorHandler = null
    } = options;

    // Dismiss loading toast if provided
    if (loadingKey && this.loadingToasts.has(loadingKey)) {
      this.loadingToasts.get(loadingKey)();
      this.loadingToasts.delete(loadingKey);
    }

    // Extract error message
    let errorMsg = errorMessage || 'An error occurred';
    
    if (error?.response?.data?.message) {
      errorMsg = error.response.data.message;
    } else if (error?.message) {
      errorMsg = error.message;
    }

    // Handle specific error types
    if (error?.response?.status === 401) {
      errorMsg = 'Session expired. Please log in again.';
    } else if (error?.response?.status === 403) {
      errorMsg = 'Access denied. You do not have permission to perform this action.';
    } else if (error?.response?.status === 404) {
      errorMsg = 'Resource not found.';
    } else if (error?.response?.status === 429) {
      errorMsg = 'Too many requests. Please try again later.';
    } else if (error?.response?.status >= 500) {
      errorMsg = 'Server error. Please try again later.';
    }

    if (customErrorHandler) {
      customErrorHandler(errorMsg, error);
    } else if (showErrorToast) {
      showError(errorMsg);
    }

    return { success: false, error: errorMsg, originalError: error };
  }

  /**
   * Show loading toast and return key for dismissal
   */
  showLoading(message, key = null) {
    const loadingKey = key || `loading_${Date.now()}`;
    const dismiss = showLoadingToast(message);
    this.loadingToasts.set(loadingKey, dismiss);
    return loadingKey;
  }

  /**
   * Dismiss loading toast by key
   */
  dismissLoading(key) {
    if (this.loadingToasts.has(key)) {
      this.loadingToasts.get(key)();
      this.loadingToasts.delete(key);
    }
  }

  /**
   * Clear all loading toasts
   */
  clearAllLoading() {
    this.loadingToasts.forEach(dismiss => dismiss());
    this.loadingToasts.clear();
  }

  /**
   * Handle authentication responses
   */
  handleAuthResponse(response, action) {
    const messages = {
      login: {
        success: 'Login successful! Welcome back.',
        error: 'Login failed. Please check your credentials.'
      },
      register: {
        success: 'Registration successful! Please verify your email.',
        error: 'Registration failed. Please try again.'
      },
      verifyOTP: {
        success: 'Email verified successfully!',
        error: 'OTP verification failed. Please try again.'
      },
      logout: {
        success: 'Logged out successfully.',
        error: 'Logout failed.'
      },
      passwordReset: {
        success: 'Password reset email sent successfully.',
        error: 'Failed to send password reset email.'
      },
      changePassword: {
        success: 'Password changed successfully.',
        error: 'Failed to change password.'
      }
    };

    const messageConfig = messages[action] || { success: 'Operation successful', error: 'Operation failed' };
    
    return this.handleResponse(response, {
      successMessage: messageConfig.success,
      errorMessage: messageConfig.error
    });
  }

  /**
   * Handle voucher responses
   */
  handleVoucherResponse(response, action) {
    const messages = {
      create: {
        success: 'Voucher created successfully!',
        error: 'Failed to create voucher.'
      },
      redeem: {
        success: 'Voucher redeemed successfully!',
        error: 'Failed to redeem voucher.'
      },
      cancel: {
        success: 'Voucher cancelled successfully.',
        error: 'Failed to cancel voucher.'
      },
      activate: {
        success: 'Voucher activated successfully.',
        error: 'Failed to activate voucher.'
      },
      upload: {
        success: 'Voucher uploaded successfully!',
        error: 'Failed to upload voucher.'
      }
    };

    const messageConfig = messages[action] || { success: 'Operation successful', error: 'Operation failed' };
    
    return this.handleResponse(response, {
      successMessage: messageConfig.success,
      errorMessage: messageConfig.error
    });
  }

  /**
   * Handle payment responses
   */
  handlePaymentResponse(response, action) {
    const messages = {
      fundWallet: {
        success: 'Wallet funding initiated successfully!',
        error: 'Failed to initiate wallet funding.'
      },
      withdraw: {
        success: 'Withdrawal request submitted successfully!',
        error: 'Failed to submit withdrawal request.'
      },
      verifyAccount: {
        success: 'Bank account verified successfully!',
        error: 'Failed to verify bank account.'
      }
    };

    const messageConfig = messages[action] || { success: 'Operation successful', error: 'Operation failed' };
    
    return this.handleResponse(response, {
      successMessage: messageConfig.success,
      errorMessage: messageConfig.error
    });
  }

  /**
   * Handle profile responses
   */
  handleProfileResponse(response, action) {
    const messages = {
      update: {
        success: 'Profile updated successfully!',
        error: 'Failed to update profile.'
      },
      get: {
        success: 'Profile loaded successfully.',
        error: 'Failed to load profile.'
      }
    };

    const messageConfig = messages[action] || { success: 'Operation successful', error: 'Operation failed' };
    
    return this.handleResponse(response, {
      successMessage: messageConfig.success,
      errorMessage: messageConfig.error,
      showSuccessToast: action !== 'get' // Don't show success toast for GET requests
    });
  }

  /**
   * Handle generic API call with loading and response handling
   */
  async handleApiCall(apiCall, options = {}) {
    const {
      loadingMessage = 'Processing...',
      successMessage,
      errorMessage,
      showSuccessToast = true,
      showErrorToast = true,
      customSuccessHandler = null,
      customErrorHandler = null
    } = options;

    const loadingKey = this.showLoading(loadingMessage);

    try {
      const response = await apiCall();
      return this.handleResponse(response, {
        successMessage,
        errorMessage,
        showSuccessToast,
        showErrorToast,
        loadingKey,
        customSuccessHandler,
        customErrorHandler
      });
    } catch (error) {
      return this.handleError(error, {
        errorMessage,
        showErrorToast,
        loadingKey,
        customErrorHandler
      });
    }
  }
}

// Create singleton instance
const apiResponseHandler = new APIResponseHandler();

export default apiResponseHandler;
