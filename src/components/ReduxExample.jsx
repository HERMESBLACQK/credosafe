import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

const ReduxExample = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'test@example.com', password: 'password' }));
    dispatch(showToast({ message: 'Logging in...', type: 'info' }));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Redux State Example</h2>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Authentication Status:</p>
          <p className="text-gray-600">
            {isAuthenticated ? `Logged in as ${user?.name}` : 'Not logged in'}
          </p>
        </div>

        <div>
          <p className="font-semibold">Theme:</p>
          <p className="text-gray-600">{theme}</p>
        </div>

        <div>
          <p className="font-semibold">Loading:</p>
          <p className="text-gray-600">{loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="flex space-x-2">
          {!isAuthenticated ? (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          ) : (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReduxExample; 