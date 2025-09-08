import { toast } from 'react-toastify';

/**
 * Toast utility functions for consistent messaging across the app
 */

// Keep a single live toast and simple dedupe
let activeToastId = null;
let lastMessageShown = '';
let lastShownAt = 0;
const DEDUPE_WINDOW_MS = 1500;

const showSingleton = (type, message, options = {}) => {
  const now = Date.now();
  if (message === lastMessageShown && now - lastShownAt < DEDUPE_WINDOW_MS) {
    return activeToastId;
  }

  lastMessageShown = message;
  lastShownAt = now;

  if (activeToastId) {
    toast.dismiss(activeToastId);
    activeToastId = null;
  }

  const showFn =
    type === 'success' ? toast.success :
    type === 'error' ? toast.error :
    type === 'warning' ? toast.warning :
    type === 'info' ? toast.info : toast;

  activeToastId = showFn(message, options);
  return activeToastId;
};

export const showSuccess = (message, options = {}) => {
  return showSingleton('success', message, {
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
  return showSingleton('error', message, {
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
  return showSingleton('warning', message, {
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
  return showSingleton('info', message, {
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
  if (activeToastId) {
    toast.dismiss(activeToastId);
    activeToastId = null;
  }
  const id = toast.loading(message, {
    position: "top-right",
    autoClose: false,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    ...options
  });
  activeToastId = id;
  return id;
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
  if (activeToastId === toastId) {
    activeToastId = null;
  }
};

export const dismissAllToasts = () => {
  toast.dismiss();
  activeToastId = null;
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



