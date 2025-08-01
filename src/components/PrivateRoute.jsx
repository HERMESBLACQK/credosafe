import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectIsAuthenticated, selectToken, fetchUserProfile } from '../store/slices/authSlice';

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const token = useSelector(selectToken);

  useEffect(() => {
    console.log('🔍 PrivateRoute - isAuthenticated:', isAuthenticated, 'token:', !!token);
    
    // Check if user is authenticated
    if (!isAuthenticated || !token) {
      console.log('🔍 Not authenticated, redirecting to signin');
      navigate('/signin', { replace: true });
      return;
    }

    // Fetch user profile if not already loaded
    console.log('🔍 Fetching user profile');
    dispatch(fetchUserProfile());
  }, [isAuthenticated, token, dispatch, navigate]);

  // Show loading while checking authentication
  if (!isAuthenticated || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600 font-medium">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute; 