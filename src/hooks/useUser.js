import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectIsLoading, fetchUserProfile } from '../store/slices/authSlice';

export const useUser = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    // Fetch user data if authenticated but no user data
    if (isAuthenticated && !user && !isLoading) {
      console.log('🔄 useUser: Fetching user profile');
      dispatch(fetchUserProfile());
    }
  }, [isAuthenticated, user, isLoading, dispatch]);

  // Memoize userProfile to prevent infinite loops
  const userProfile = useMemo(() => ({
    id: user?.id,
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    avatarUrl: user?.avatarUrl || '',
    joinDate: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    }) : '',
    wallet: user?.wallet || { balance: 0 },
    settings: {
      pushNotifications: user?.pushNotifications ?? true,
      emailAlerts: user?.emailAlerts ?? true,
      transactionNotifications: user?.transactionNotifications ?? true,
      emailPreferences: user?.emailPreferences ?? true,
      twoFactorAuth: user?.twoFactorAuth ?? false
    }
  }), [user]);

  return {
    user,
    isAuthenticated,
    isLoading,
    userProfile,
    // Check if user data is loaded
    isUserLoaded: !!user,
    // Check if user has specific data
    hasProfile: !!(user?.firstName && user?.lastName),
    hasWallet: !!user?.wallet,
    hasPhone: !!user?.phone,
    hasLocation: !!user?.location
  };
}; 