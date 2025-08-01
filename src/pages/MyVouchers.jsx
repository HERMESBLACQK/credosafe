import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Eye, Download, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import apiService from '../api/index';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/toastSlice';

const MyVouchers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await apiService.vouchers.getMyVouchers();
        if (response.success) {
          setVouchers(response.data?.vouchers || []);
        } else {
          dispatch(showToast({
            message: response.message || 'Failed to fetch vouchers',
            type: 'error'
          }));
        }
      } catch (error) {
        console.error('Fetch vouchers error:', error);
        dispatch(showToast({
          message: 'Failed to fetch vouchers',
          type: 'error'
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [dispatch]);

  const getVoucherTypeIcon = (type) => {
    switch (type) {
      case 'work_order':
        return '🔧';
      case 'purchase_escrow':
        return '🔒';
      case 'prepaid':
        return '💳';
      case 'gift_card':
        return '🎁';
      default:
        return '📄';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading vouchers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </motion.div>
            <motion.button 
              onClick={() => navigate('/dashboard')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">My Vouchers</h1>
            <p className="text-neutral-600">View and manage all your created vouchers</p>
          </div>

          {vouchers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📄</span>
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No vouchers yet</h3>
              <p className="text-neutral-600 mb-6">Create your first voucher to get started</p>
              <button
                onClick={() => navigate('/create-voucher')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Voucher
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vouchers.map((voucher) => (
                <motion.div
                  key={voucher.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-soft p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getVoucherTypeIcon(voucher.type)}</span>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{voucher.title}</h3>
                        <p className="text-sm text-neutral-600 capitalize">{voucher.type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                      {voucher.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Amount:</span>
                      <span className="font-semibold text-neutral-900">₦{parseFloat(voucher.total_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Code:</span>
                      <span className="font-mono text-sm text-neutral-900">{voucher.voucher_code}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600">Created:</span>
                      <span className="text-sm text-neutral-900">
                        {new Date(voucher.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white py-2 px-3 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center justify-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyVouchers; 