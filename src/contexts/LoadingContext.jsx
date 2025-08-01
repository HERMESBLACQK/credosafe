import React, { createContext, useContext, useState } from 'react';
import Loader from '../components/Loader';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [globalLoading, setGlobalLoading] = useState(false);

  const startLoading = (key, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: true, text }
    }));
  };

  const stopLoading = (key) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: false, text: '' }
    }));
  };

  const isLoading = (key) => {
    return loadingStates[key]?.isLoading || false;
  };

  const getLoadingText = (key) => {
    return loadingStates[key]?.text || 'Loading...';
  };

  const startGlobalLoading = (text = 'Loading...') => {
    setGlobalLoading(true);
  };

  const stopGlobalLoading = () => {
    setGlobalLoading(false);
  };

  const value = {
    startLoading,
    stopLoading,
    isLoading,
    getLoadingText,
    startGlobalLoading,
    stopGlobalLoading,
    globalLoading
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {globalLoading && (
        <Loader 
          fullScreen={true} 
          text="Processing your request..." 
          size="large"
        />
      )}
    </LoadingContext.Provider>
  );
}; 