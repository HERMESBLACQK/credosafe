import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
import { showToast } from '../store/slices/uiSlice';
import FloatingFooter from '../components/FloatingFooter';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { vouchers, loading } = useSelector((state) => state.vouchers);

  // Mock user balance and transactions
  const userBalance = 1250.75;
  const recentTransactions = [
    {
      id: '1',
      type: 'funding',
      amount: 500.00,
      description: 'Voucher Funding',
      date: '2024-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: -150.25,
      description: 'Voucher Redemption',
      date: '2024-01-14T14:20:00Z',
      status: 'completed'
    },
    {
      id: '3',
      type: 'funding',
      amount: 750.00,
      description: 'Work Order Payment',
      date: '2024-01-13T09:15:00Z',
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -200.00,
      description: 'Purchase Escrow Release',
      date: '2024-01-12T16:45:00Z',
      status: 'completed'
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
      return;
    }
    
    // Fetch user's vouchers
    dispatch(fetchVouchers());
  }, [isAuthenticated, navigate, dispatch]);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="flex items-center space-x-2 text-neutral-600">
                <User className="w-5 h-5" />
                <span className="font-medium">{user?.name}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp} className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {user?.firstName || user?.name}!
            </h1>
            <p className="text-neutral-600">
              Here's your CredoSafe dashboard overview
            </p>
          </motion.div>

          {/* Balance Card */}
          <motion.div variants={fadeInUp} className="mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-8 h-8" />
                  <h2 className="text-xl font-semibold">Current Balance</h2>
                </div>
                <DollarSign className="w-8 h-8 opacity-80" />
              </div>
              <div className="text-4xl font-bold mb-2">
                {formatCurrency(userBalance)}
              </div>
              <p className="text-primary-100">
                Available for vouchers and transactions
              </p>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                    {formatCurrency(1250.75)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Recent Transactions</h3>
              <p className="text-neutral-600">Your latest funding and redemption activities</p>
            </div>
            <div className="divide-y divide-neutral-200">
              {recentTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                </motion.div>
              ))}
            </div>
            <div className="p-4 border-t border-neutral-200">
              <button className="w-full text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2">
                <span>View All Transactions</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Dashboard; 