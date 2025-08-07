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
  Loader
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
  const [currentBalance, setCurrentBalance] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    showing: '0-0 of 0'
  });
  
  // Animation variants - single definition
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };
  
  // Get balance from location state or fetch it
  useEffect(() => {
    if (location.state?.currentBalance) {
      setCurrentBalance(location.state.currentBalance);
    } else {
      // Fallback to fetch balance if not passed in state
      fetchWalletBalance();
    }
  }, [location.state]);
  
  const fetchWalletBalance = async () => {
    try {
      const response = await apiService.get('/wallet/balance');
      if (response.data?.balance !== undefined) {
        setCurrentBalance(response.data.balance);
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
    }
  };

  // Format date to local string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date.getTime()) 
      ? 'Invalid Date' 
      : date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
  };

  // Format amount with currency
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Shorten reference number
  const shortenReference = (ref) => {
    if (!ref) return 'N/A';
    if (ref.length <= 12) return ref;
    return `${ref.substring(0, 6)}...${ref.substring(ref.length - 6)}`;
  };

  // Copy reference to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      dispatch(showToast({ 
        message: 'Reference copied to clipboard!',
        type: 'success' 
      }));
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Get status badge class and color - consolidated with getStatusColor
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'success':
      case 'successful':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get transaction icon based on type - single implementation
  const getTransactionIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'credit':
      case 'funding':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'debit':
      case 'withdrawal':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <DollarSign className="w-5 h-5 text-blue-500" />;
    }
  };

  // Fetch transactions from API with enhanced logging and error handling
  const fetchTransactions = async (page = 1) => {
    const limit = 10;
    const offset = (page - 1) * limit;
    
    try {
      setIsLoading(true);
      console.log('Fetching transactions with params:', { page, limit, offset });
      
      // Fetch transactions from the unified endpoint
      const response = await apiService.get(`/wallet/transactions?page=${page}&limit=${limit}`);
      
      console.log('Transactions API response:', response);
      
      if (response.data && Array.isArray(response.data.transactions)) {
        const { transactions: txns, pagination: paginationData, summary } = response.data;
        
        // Transform transactions to ensure consistent data structure
        const formattedTransactions = txns.map(tx => ({
          id: tx.id,
          reference: tx.reference || tx.transaction_reference || 'N/A',
          type: tx.type || (tx.amount >= 0 ? 'credit' : 'debit'),
          amount: Math.abs(parseFloat(tx.amount) || 0),
          status: tx.status?.toLowerCase() || 'pending',
          description: tx.description || tx.purpose || 'Wallet Transaction',
          created_at: tx.created_at,
          meta_data: tx.meta_data || {}
        }));
        
        setTransactions(formattedTransactions);
        
        // Update pagination with server-provided data if available
        if (paginationData) {
          setPagination({
            page: paginationData.page || page,
            limit: paginationData.limit || limit,
            total: paginationData.total || 0,
            pages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / limit),
            showing: paginationData.showing || `1-${formattedTransactions.length} of ${paginationData.total || 0}`
          });
        }
        
        // Update balance from summary if available
        if (summary?.net_balance !== undefined) {
          setCurrentBalance(summary.net_balance);
        }
      } else {
        console.error('Unexpected response format:', response);
        throw new Error('Invalid response format from server');
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

  // Mock wallet transaction data (fallback)
  const mockTransactions = [
    {
      id: '1',
      type: 'funding',
      amount: 500.00,
      description: 'Bank Transfer',
      date: '2024-01-15T10:30:00Z',
      status: 'completed',
      reference: 'WT-001',
      method: 'Bank Transfer',
      bankName: 'GT Bank'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: -150.25,
      description: 'Withdrawal to GT Bank',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      reference: 'WT-002',
      method: 'Bank Transfer',
      bankName: 'GT Bank',
      accountNumber: '0123456789'
    },
    {
      id: '3',
      type: 'funding',
      amount: 750.00,
      description: 'Card Payment',
      date: '2024-01-13T09:15:00Z',
      status: 'completed',
      reference: 'WT-003',
      method: 'Card Payment',
      cardType: 'Visa'
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -200.00,
      description: 'Withdrawal to Access Bank',
      date: '2024-01-12T16:45:00Z',
      status: 'pending',
      reference: 'WT-004',
      method: 'Bank Transfer',
      bankName: 'Access Bank',
      accountNumber: '9876543210'
    },
    {
      id: '5',
      type: 'funding',
      amount: 1000.00,
      description: 'USSD Payment',
      date: '2024-01-11T11:30:00Z',
      status: 'completed',
      reference: 'WT-005',
      method: 'USSD',
      bankName: 'First Bank'
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: -75.50,
      description: 'Withdrawal to Zenith Bank',
      date: '2024-01-10T13:20:00Z',
      status: 'completed',
      reference: 'WT-006',
      method: 'Bank Transfer',
      bankName: 'Zenith Bank',
      accountNumber: '1234567890'
    }
  ];

  // Use real transactions or fallback to mock data
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  const [filteredTransactions, setFilteredTransactions] = useState(displayTransactions);

  // Update filtered transactions when filters or transactions change
  useEffect(() => {
    const filtered = displayTransactions.filter(transaction => {
      // Skip if transaction is not defined
      if (!transaction) return false;
      
      const searchLower = searchTerm.toLowerCase();
      const typeLower = selectedType.toLowerCase();
      const statusLower = selectedStatus.toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        (transaction.reference && transaction.reference.toLowerCase().includes(searchLower)) ||
        (transaction.description && transaction.description.toLowerCase().includes(searchLower));
      
      const matchesType = typeLower === 'all' || 
        (transaction.type && transaction.type.toLowerCase() === typeLower);
      
      const matchesStatus = statusLower === 'all' || 
        (transaction.status && transaction.status.toLowerCase() === statusLower);
      
      return matchesSearch && matchesType && matchesStatus;
    });
    
    setFilteredTransactions(filtered);
  }, [searchTerm, selectedType, selectedStatus, displayTransactions]);

  // Format date to display only date part (removed duplicate)
  // Format time to display only time part (removed duplicate)
  // Get appropriate icon based on transaction type (removed duplicate)

  // Get status color based on transaction status
  const getStatusColor = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch (status.toLowerCase()) {
      case 'completed':
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type color based on transaction type
  const getTypeColor = (type) => {
    if (!type) return 'text-gray-600';
    return type.toLowerCase() === 'funding' || type.toLowerCase() === 'credit' 
      ? 'text-green-600' 
      : 'text-red-600';
  };

  // Calculate totals for the dashboard
  const totalIncome = transactions
    .filter(t => t && (t.type === 'funding' || t.type === 'credit') && t.status === 'completed')
    .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

  const totalExpenses = transactions
    .filter(t => t && (t.type === 'withdrawal' || t.type === 'debit') && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(parseFloat(t.amount) || 0), 0);

  const calculatedBalance = totalIncome - totalExpenses;

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
        </motion.div>

          {/* Balance Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Wallet Summary</h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} hover:bg-blue-100`}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          {/* Balance Card */}
          <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-100">Available Balance</p>
                <div className="flex items-center mt-1">
                  <Shield className="w-5 h-5 mr-2" />
                  <span className="text-3xl font-bold">
                    {showBalance ? formatAmount(currentBalance) : '••••••'}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/wallet/fund')}
                  className="flex items-center space-x-1 px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Fund</span>
                </button>
                <button
                  onClick={() => navigate('/wallet/withdraw')}
                  className="flex items-center space-x-1 px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-medium hover:bg-blue-50"
                >
                  <Minus className="w-4 h-4" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 bg-white rounded-xl shadow-sm p-6 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  id="type"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear filters
              </button>
            </div>
          </motion.div>
        )}

      
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transaction History</h2>
              <p className="text-sm text-gray-500 mt-1">View all your wallet transactions</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <span className="text-gray-700">{filteredTransactions.length}</span>
                <span className="text-gray-500 ml-1">
                  {filteredTransactions.length === 1 ? 'transaction' : 'transactions'}
                </span>
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <Filter className="w-4 h-4 mr-1" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading transactions...</span>
            </div>
          ) : filteredTransactions.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <motion.li 
                  key={transaction.id || transaction.reference || Math.random().toString(36).substr(2, 9)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2.5 rounded-full ${getStatusColor(transaction.status)}`}>
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {transaction.description || 'No description'}
                            </p>
                            {transaction.reference && (
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(transaction.reference);
                                  dispatch(showToast({
                                    message: 'Reference copied to clipboard!',
                                    type: 'success'
                                  }));
                                }}
                                className="ml-2 text-gray-400 hover:text-gray-600"
                                title="Copy reference"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                </svg>
                              </button>
                            )}
                          </div>
                          <div className="flex items-center flex-wrap gap-1.5 mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {transaction.type ? transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) : 'Transaction'}
                            </span>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {formatDate(transaction.date || transaction.created_at)}
                            </span>
                            {transaction.reference && (
                              <div className="flex items-center space-x-1">
                                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {transaction.reference}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-medium ${
                            transaction.type === 'funding' || transaction.type === 'credit'
                              ? 'text-green-600'
                              : 'text-red-600'
                          }`}
                        >
                          {(transaction.type === 'funding' || transaction.type === 'credit') ? '+' : '-'}
                          {formatAmount(transaction.amount)}
                        </p>
                        {transaction.status && (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              getStatusColor(transaction.status)
                            }`}
                          >
                            {transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1).toLowerCase()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                <Clock className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No matching transactions
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>

      <FloatingFooter />
    </div>
  );
};

export default WalletTransactions;