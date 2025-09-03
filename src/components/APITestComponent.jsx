import React, { useState } from 'react';
import apiService from '../api';
import { showSuccess, showError, showInfo } from '../utils/toast';

/**
 * API Test Component - Tests all endpoints to ensure proper integration
 * This component should be removed in production
 */
const APITestComponent = () => {
  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runTest = async (testName, testFunction) => {
    try {
      setTestResults(prev => ({ ...prev, [testName]: { status: 'running', message: 'Testing...' } }));
      const result = await testFunction();
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'success', 
          message: 'Test passed',
          data: result 
        } 
      }));
      showSuccess(`${testName} test passed!`);
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          status: 'error', 
          message: error.message || 'Test failed',
          error: error 
        } 
      }));
      showError(`${testName} test failed: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults({});

    // Test Auth Endpoints
    await runTest('Auth - Login', async () => {
      const result = await apiService.auth.login({
        email: 'test@example.com',
        password: 'testpassword',
        deviceInfo: { userAgent: 'test', ipAddress: '127.0.0.1' }
      });
      return result;
    });

    await runTest('Auth - Register', async () => {
      const result = await apiService.auth.register({
        first_name: 'Test',
        last_name: 'User',
        email: 'testuser@example.com',
        password: 'testpassword123'
      });
      return result;
    });

    await runTest('Auth - Verify OTP', async () => {
      const result = await apiService.auth.verifyOTP({
        email: 'test@example.com',
        otp: '123456'
      });
      return result;
    });

    await runTest('Auth - Request Password Reset', async () => {
      const result = await apiService.auth.requestPasswordReset({
        email: 'test@example.com'
      });
      return result;
    });

    await runTest('Auth - Get Profile', async () => {
      const result = await apiService.auth.getProfile();
      return result;
    });

    // Test Voucher Endpoints
    await runTest('Vouchers - Get All', async () => {
      const result = await apiService.vouchers.getAll();
      return result;
    });

    await runTest('Vouchers - Create', async () => {
      const result = await apiService.vouchers.create({
        type: 'work_order',
        title: 'Test Voucher',
        description: 'Test Description',
        amount: 1000,
        recipient_email: 'recipient@example.com'
      });
      return result;
    });

    await runTest('Vouchers - Get Balance', async () => {
      const result = await apiService.vouchers.getBalance();
      return result;
    });

    await runTest('Vouchers - Search by Code', async () => {
      const result = await apiService.vouchers.searchByCode('TEST123');
      return result;
    });

    // Test Payment Endpoints
    await runTest('Payments - Get Wallet Balance', async () => {
      const result = await apiService.payments.getWalletBalance();
      return result;
    });

    await runTest('Payments - Get Wallet Transactions', async () => {
      const result = await apiService.payments.getWalletTransactions(1, 10);
      return result;
    });

    await runTest('Payments - Get Banks', async () => {
      const result = await apiService.payments.getBanks();
      return result;
    });

    await runTest('Payments - Fund Wallet', async () => {
      const result = await apiService.payments.fundWallet({
        amount: 1000,
        currency: 'NGN',
        payment_method: 'card'
      });
      return result;
    });

    // Test Theme Endpoints
    await runTest('Themes - Get by Voucher Type', async () => {
      const result = await apiService.themes.getByVoucherType('work_order');
      return result;
    });

    // Test Public Voucher Endpoints
    await runTest('Public Vouchers - Search by Code', async () => {
      const result = await apiService.publicVouchers.searchByCode('PUBLIC123');
      return result;
    });

    setIsRunning(false);
    showInfo('All API tests completed!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'running': return '⏳';
      default: return '⏸️';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">API Endpoint Tests</h2>
        <p className="text-gray-600">
          This component tests all API endpoints to ensure proper integration with the server.
          <span className="text-red-600 font-semibold"> Remove this component in production!</span>
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className={`px-6 py-3 rounded-lg font-semibold ${
            isRunning
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isRunning ? 'Running Tests...' : 'Run All API Tests'}
        </button>
      </div>

      <div className="space-y-4">
        {Object.entries(testResults).map(([testName, result]) => (
          <div key={testName} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800">{testName}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(result.status)}`}>
                {getStatusIcon(result.status)} {result.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">{result.message}</p>
            {result.data && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-blue-600 hover:text-blue-800">
                  View Response Data
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
            {result.error && (
              <details className="mt-2">
                <summary className="cursor-pointer text-sm text-red-600 hover:text-red-800">
                  View Error Details
                </summary>
                <pre className="mt-2 p-3 bg-red-50 rounded text-xs overflow-auto">
                  {JSON.stringify(result.error, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>

      {Object.keys(testResults).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No tests run yet. Click "Run All API Tests" to start testing.</p>
        </div>
      )}
    </div>
  );
};

export default APITestComponent;
