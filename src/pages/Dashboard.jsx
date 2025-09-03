import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../contexts/LoadingContext';
import Loader from '../components/Loader';
import { useUser } from '../hooks/useUser';
import { useError } from '../contexts/ErrorContext';
import { 
  Shield, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Wallet,
  CreditCard
} from 'lucide-react';
import { fetchVouchers } from '../store/slices/voucherSlice';
import FloatingFooter from '../components/FloatingFooter';



const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userProfile, isAuthenticated, isUserLoaded } = useUser();
  const { vouchers = [] } = useSelector((state) => state.vouchers);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const { startLoading, stopLoading } = useLoading();

  // Convert vouchers to transaction format for display
  const recentTransactions = Array.isArray(vouchers) ? vouchers.slice(0, 4).map(voucher => ({
    id: voucher.id,
    type: 'funding',
    amount: parseFloat(voucher.total_amount),
    description: `${voucher.type ? voucher.type.replace('-', ' ').toUpperCase() : 'Voucher'} Voucher Created`,
    date: voucher.created_at,
    status: voucher.status
  })) : [];

  useEffect(() => {
    if (!isUserLoaded) {
      startLoading('dashboard', 'Loading dashboard data...');
      return;
    }

    if (!isAuthenticated) {
      console.log('🔍 Not authenticated, redirecting to signin');
      navigate('/signin');
      stopLoading('dashboard');
      return;
    }

    // Fetch user's vouchers
    dispatch(fetchVouchers());

    // Set balance from user profile
    try {
      setIsLoadingBalance(true);
      if (userProfile?.wallet?.balance !== undefined) {
        setUserBalance(userProfile.wallet.balance);
      } else {
        setUserBalance(0);
      }
    } catch (error) {
      console.error('Balance error:', error);
      setUserBalance(0);
    } finally {
      setIsLoadingBalance(false);
      stopLoading('dashboard');
    }
  }, [isUserLoaded, isAuthenticated, navigate, dispatch, userProfile]);



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'funding' ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };



  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </div>
            <div 
              className="flex items-center space-x-3"
            >
              <div className="flex items-center space-x-2 text-neutral-600">
                <User className="w-5 h-5" />
                <span className="font-medium">{userProfile.firstName || user?.firstName || user?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          {/* User Data Display (for debugging) */}
  
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {userProfile.firstName || user?.firstName || user?.name}!
            </h1>
            <p className="text-neutral-600">
              Here's your CredoSafe dashboard overview
            </p>
          </div>

          {/* Balance Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-8 h-8" />
                  <h2 className="text-xl font-semibold">Current Balance</h2>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {isLoadingBalance ? 'Loading...' : formatCurrency(userBalance)}
              </div>
              <p className="text-primary-100">
                Available for vouchers and transactions
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Active Vouchers</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {vouchers.filter(v => v.status === 'active').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Vouchers</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {vouchers.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">This Month</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {formatCurrency(vouchers.reduce((total, voucher) => {
                      const voucherDate = new Date(voucher.created_at);
                      const currentDate = new Date();
                      if (voucherDate.getMonth() === currentDate.getMonth() && 
                          voucherDate.getFullYear() === currentDate.getFullYear()) {
                        return total + parseFloat(voucher.total_amount || 0);
                      }
                      return total;
                    }, 0))}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Recent Transactions</h3>
              <p className="text-neutral-600">Your latest funding and redemption activities</p>
            </div>
            <div className="divide-y divide-neutral-200">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-6 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {transaction.description}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-neutral-500">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${
                        transaction.type === 'funding' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.type === 'funding' ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <span className="text-sm text-neutral-500 capitalize">
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-200">
              <button 
                onClick={() => navigate('/transactions')}
                className="w-full text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2"
              >
                <span>View All Transactions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Dashboard; 