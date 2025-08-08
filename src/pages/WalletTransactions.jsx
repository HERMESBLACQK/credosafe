import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Shield, 
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Filter,
  Search,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  Loader,
  Copy,
  CheckCircle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api';
import { showToast } from '../store/slices/toastSlice';
import { useError } from '../contexts/ErrorContext';

const WalletTransactions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedRef, setCopiedRef] = useState(null);
  const [walletBalance, setWalletBalance] = useState(location.state?.balance ?? null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Fetch transactions from API with enhanced logging
  const fetchTransactions = async (page = 1) => {
    const limit = 10;
    try {
      setIsLoading(true);
      console.log(`🔄 Fetching transactions - Page: ${page}, Limit: ${limit}`);
      
      const response = await apiService.payments.getWalletTransactions(page, limit);
      
      console.log('📋 Wallet transactions response:', {
        success: response.success,
        data: response.data,
        transactions: response.data?.transactions,
        pagination: response.data?.pagination
      });
      
      if (response.success) {
        const transactions = response.data.transactions || [];
        const pagination = response.data.pagination || {};
        
        console.log(`✅ Successfully loaded ${transactions.length} transactions`, {
          page: pagination.page,
          limit: pagination.limit,
          total: pagination.total,
          pages: pagination.pages
        });
        
        setTransactions(transactions);
        setPagination({
          page: pagination.page || page,
          limit: pagination.limit || limit,
          total: pagination.total || 0,
          pages: pagination.pages || 1
        });
      } else {
        console.warn('⚠️ Failed to fetch transactions:', response.message);
        dispatch(showToast({ 
          type: 'error', 
          message: response.message || 'Failed to fetch transactions' 
        }));
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      dispatch(showToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Failed to fetch transactions' 
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Load transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        (transaction.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (String(transaction.reference) || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.method || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type (map credit->funding, debit->withdrawal)
    if (selectedType !== 'all') {
      filtered = filtered.filter(transaction => {
        const dir = transaction.type === 'credit' ? 'funding' : 'withdrawal';
        return dir === selectedType;
      });
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === selectedStatus);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, selectedType, selectedStatus]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    return type === 'funding' ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeColor = (type) => {
    return type === 'funding' ? 'text-green-600' : 'text-red-600';
  };

  const totalIncome = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentBalance = walletBalance ?? (totalIncome - totalExpenses);

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
              onClick={() => navigate('/wallet')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Wallet</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Wallet Transactions</h1>
            <p className="text-neutral-600">View all your wallet funding and withdrawal history</p>
          </div>

          {/* Balance Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Wallet Summary</h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm">{showBalance ? 'Hide' : 'Show'} Balance</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {showBalance ? formatCurrency(currentBalance) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Funding</p>
                <p className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(totalIncome) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Withdrawals</p>
                <p className="text-2xl font-bold text-red-600">
                  {showBalance ? formatCurrency(totalExpenses) : '••••••'}
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-neutral-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
              </button>

              {/* Export */}
              <button className="flex items-center space-x-2 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                <Download className="w-5 h-5" />
                <span>Export</span>
              </button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-neutral-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Types</option>
                      <option value="funding">Funding</option>
                      <option value="withdrawal">Withdrawal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-neutral-900">
                  Transaction History ({filteredTransactions.length})
                </h3>
                <p className="text-sm text-neutral-600">
                  Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
              </div>
            </div>
            <div className="divide-y divide-neutral-200">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
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
                          {getTransactionIcon(transaction.type === 'credit' ? 'funding' : 'withdrawal')}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {transaction.description}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.created_at || transaction.date)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(transaction.created_at || transaction.date)}</span>
                            </span>
                            <span className="bg-neutral-100 px-2 py-1 rounded text-xs">
                              {transaction.method}
                            </span>
                            {transaction.bankName && (
                              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs">
                                {transaction.bankName}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                            <span>
                              Ref: {transaction.reference ? `${String(transaction.reference).slice(0,6)}...${String(transaction.reference).slice(-4)}` : '—'}
                            </span>
                            {transaction.reference && (
                              <button
                                type="button"
                                onClick={async () => {
                                  try {
                                    await navigator.clipboard.writeText(String(transaction.reference));
                                    setCopiedRef(transaction.id);
                                    setTimeout(() => setCopiedRef(null), 1200);
                                  } catch (e) {
                                    dispatch(showToast({ type: 'error', message: 'Failed to copy reference' }));
                                  }
                                }}
                                className="inline-flex items-center text-neutral-500 hover:text-neutral-700"
                                title="Copy reference"
                              >
                                {copiedRef === transaction.id ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                          {transaction.accountNumber && (
                            <p className="text-xs text-neutral-400">
                              Account: {transaction.accountNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getTypeColor(transaction.type === 'credit' ? 'funding' : 'withdrawal')}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(Math.abs(Number(transaction.amount) || 0))}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <CreditCard className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No transactions found</h3>
                  <p className="text-neutral-600">
                    {searchTerm || selectedType !== 'all' || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'You haven\'t made any wallet transactions yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default WalletTransactions; 