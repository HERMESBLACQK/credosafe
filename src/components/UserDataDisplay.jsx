import React from 'react';
import { useUser } from '../hooks/useUser';

const UserDataDisplay = ({ showDetails = false }) => {
  const { user, userProfile, isUserLoaded, isLoading, hasProfile, hasWallet } = useUser();

  if (isLoading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-blue-800 font-medium">Loading user data...</span>
        </div>
      </div>
    );
  }

  if (!isUserLoaded) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-yellow-800 font-medium">⚠️ User data not loaded</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-green-800 font-medium">✅ User data loaded successfully</span>
        </div>
        <div className="text-sm text-green-700">
          {hasProfile ? '📝 Profile Complete' : '📝 Profile Incomplete'} | 
          {hasWallet ? '💰 Wallet Available' : '💰 No Wallet'}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 text-sm text-green-700">
          <div><strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}</div>
          <div><strong>Email:</strong> {userProfile.email}</div>
          <div><strong>Balance:</strong> ₦{userProfile.wallet.balance?.toLocaleString() || '0'}</div>
          <div><strong>Phone:</strong> {userProfile.phone || 'Not set'}</div>
          <div><strong>Location:</strong> {userProfile.location || 'Not set'}</div>
        </div>
      )}
    </div>
  );
};

export default UserDataDisplay; 