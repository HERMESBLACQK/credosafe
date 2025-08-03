import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, X, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  onRetry, 
  onClose, 
  type = 'error',
  showIcon = true,
  className = '' 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <AlertCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-red-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`rounded-lg border p-4 ${getBgColor()} ${className}`}
    >
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3 mt-0.5">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {message}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-1 rounded-md hover:bg-white/50 transition-colors"
              title="Retry"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
          )}
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md hover:bg-white/50 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage; 