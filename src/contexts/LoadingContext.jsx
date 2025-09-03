import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const startLoading = useCallback((key, text = 'Loading...') => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: true, text }
    }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: { isLoading: false, text: '' }
    }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key]?.isLoading || false;
  }, [loadingStates]);

  const getLoadingText = useCallback((key) => {
    return loadingStates[key]?.text || 'Loading...';
  }, [loadingStates]);

  const startGlobalLoading = useCallback((text = 'Loading...') => {
    setGlobalLoading(true);
  }, []);

  const stopGlobalLoading = useCallback(() => {
    setGlobalLoading(false);
  }, []);

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