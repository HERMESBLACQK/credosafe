import { toast } from 'react-toastify';

/**
 * Toast utility functions for consistent messaging across the app
 */

export const showSuccess = (message, options = {}) => {
  return toast.success(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

export const showError = (message, options = {}) => {
  return toast.error(message, {
    position: "top-right",
    autoClose: 7000, // Longer for errors
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

export const showWarning = (message, options = {}) => {
  return toast.warning(message, {
    position: "top-right",
    autoClose: 6000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

export const showInfo = (message, options = {}) => {
  return toast.info(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    ...options
  });
};

export const showLoading = (message, options = {}) => {
  return toast.loading(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    ...options
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Handle API errors consistently
 */
export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  let message = defaultMessage;
  
  if (error?.response?.data?.message) {
    message = error.response.data.message;
  } else if (error?.message) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }
  
  showError(message);
  return message;
};

/**
 * Handle API success messages consistently
 */
export const handleApiSuccess = (message, options = {}) => {
  showSuccess(message, options);
};

/**
 * Show loading toast and return dismiss function
 */
export const showLoadingToast = (message) => {
  const toastId = showLoading(message);
  return () => dismissToast(toastId);
};

