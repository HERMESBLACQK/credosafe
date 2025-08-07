import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVouchers } from '../store/slices/voucherSlice';
import apiService from '../api/index';
import { useUser } from '../hooks/useUser';
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
  X,
  Share2,
  Handshake,
  Lock,
  Gift,
  User,
  FileText,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Sparkles,
  Star,
  Heart
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const Transactions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, userProfile, isUserLoaded } = useUser();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [_themes, setThemes] = useState({});
  const [_loadingThemes, setLoadingThemes] = useState(false);
  
  // New state for transactions
  const [transactions, setTransactions] = useState([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Function definitions
  const fetchBalance = async () => {
    try {
      setIsLoadingBalance(true);
      // Use balance from user profile
      if (isUserLoaded && userProfile?.wallet?.balance !== undefined) {
        setUserBalance(userProfile.wallet.balance);
      } else {
        setUserBalance(0);
      }
    } catch (error) {
      console.error('Balance error:', error);
      setUserBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      console.log('🔍 Fetching transactions...');
      const response = await apiService.vouchers.getTransactions();
      console.log('📊 Transactions response:', response);
      
      if (response.success) {
        setTransactions(response.data || []);
        console.log('✅ Transactions loaded:', response.data?.length);
      } else {
        console.error('❌ Failed to fetch transactions:', response.message);
        setTransactions([]);
      }
    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const fetchThemes = async () => {
    try {
      setLoadingThemes(true);
      const voucherTypes = ['gift_card', 'work_order', 'purchase_escrow', 'prepaid'];
      const themesData = {};
      
      for (const voucherType of voucherTypes) {
        try {
          console.log(`🎨 Fetching themes for ${voucherType}...`);
        const response = await apiService.themes.getByVoucherType(voucherType);
        console.log(`🎨 Fetched themes for ${voucherType}:`, response);
        if (response.success) {
          themesData[voucherType] = response.data || [];
            console.log(`🎨 ${voucherType} themes count:`, themesData[voucherType].length);
          } else {
            console.warn(`⚠️ Failed to fetch themes for ${voucherType}:`, response.message);
            themesData[voucherType] = [];
          }
        } catch (typeError) {
          console.error(`❌ Error fetching themes for ${voucherType}:`, typeError);
          themesData[voucherType] = [];
        }
      }
      
      console.log('🎨 All themes data:', themesData);
      setThemes(themesData);
    } catch (error) {
      console.error('❌ Overall themes fetch error:', error);
      setThemes({});
    } finally {
      setLoadingThemes(false);
    }
  };

  useEffect(() => {
    dispatch(fetchVouchers());

    if (isUserLoaded) {
      fetchBalance();
      fetchTransactions();
      fetchThemes();
    }
  }, [dispatch, isUserLoaded]);

  // Separate useEffect for balance updates when user profile changes
  useEffect(() => {
    if (isUserLoaded && userProfile?.wallet?.balance !== undefined) {
      console.log('🔍 Transactions: Updating balance from userProfile:', userProfile.wallet.balance);
      setUserBalance(userProfile.wallet.balance);
    }
  }, [userProfile?.wallet?.balance, isUserLoaded]);

  // Debug: Log transactions data
  useEffect(() => {
    console.log('🔍 Transactions data:', transactions);
    console.log('🔍 Transactions type:', typeof transactions);
    console.log('🔍 Transactions is array:', Array.isArray(transactions));
    if (Array.isArray(transactions)) {
      console.log('🔍 Transactions length:', transactions.length);
      console.log('🔍 First transaction:', transactions[0]);
    }
  }, [transactions]);

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (transaction.title && transaction.title.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === selectedType);
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
    return type === 'credit' ? 
      <TrendingUp className="w-5 h-5 text-green-500" /> : 
      <TrendingDown className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getTypeColor = (type) => {
    return type === 'credit' ? 'text-green-600' : 'text-red-600';
  };

  const handleVoucherClick = (transaction) => {
    console.log('🔍 handleVoucherClick called with transaction:', transaction);
    
    // Only allow clicking on voucher creations (debit transactions)
    if (transaction.type === 'debit' && transaction.id) {
      console.log('🔍 Navigating to voucher preview with ID:', transaction.id);
      navigate(`/voucher-preview/${transaction.id}`);
    } else {
      console.log('🔍 Transaction is not a voucher creation or has no ID');
    }
  };

  const totalIncome = transactions
    .filter(t => t.type === 'credit' && (t.status === 'completed' || t.status === 'active'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'debit' && (t.status === 'completed' || t.status === 'active'))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  // Use wallet balance from database instead of calculating from transactions
  const currentBalance = userBalance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
            </div>
        
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Transactions</h1>
            <p className="text-neutral-600">View and manage your transaction history</p>
          </div>

          {/* Balance Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Account Summary</h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="text-sm">{showBalance ? 'Hide' : 'Show'} Balance</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {showBalance ? (isLoadingBalance ? 'Loading...' : formatCurrency(currentBalance)) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Income (Redemptions)</p>
                <p className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(totalIncome) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Expenses (Creations)</p>
                <p className="text-2xl font-bold text-red-600">
                  {showBalance ? formatCurrency(totalExpenses) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {transactions.length}
                </p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-neutral-600">Voucher Creations</p>
                  <p className="font-semibold text-red-600">{transactions.filter(t => t.type === 'debit').length}</p>
                </div>
                <div className="text-center">
                  <p className="text-neutral-600">Voucher Redemptions</p>
                  <p className="font-semibold text-green-600">{transactions.filter(t => t.type === 'credit').length}</p>
                </div>
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
              <div className="mt-4 pt-4 border-t border-neutral-200">
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
                      <option value="credit">Credit (Voucher Creation)</option>
                      <option value="debit">Debit (Voucher Redemption)</option>
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
              </div>
            )}
          </div>

          {/* Transactions List */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-4 border-b border-neutral-200">
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
              {isLoadingTransactions ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-neutral-600">Loading transactions...</p>
                </div>
              ) : filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div
                    key={`${transaction.type}-${transaction.id}`}
                    className={`p-4 sm:p-6 transition-colors ${
                      transaction.type === 'debit' ? 'hover:bg-neutral-50 cursor-pointer' : 'hover:bg-neutral-50'
                    }`}
                    onClick={() => transaction.type === 'debit' && handleVoucherClick(transaction)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex items-start space-x-3 sm:space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-1 sm:space-y-0">
                            <p className="font-medium text-neutral-900 text-sm sm:text-base truncate">
                              {transaction.description}
                            </p>
                            {transaction.type === 'debit' && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded self-start sm:self-auto">
                                Click to view voucher
                              </span>
                            )}
                            {transaction.type === 'credit' && (
                              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded self-start sm:self-auto">
                                Voucher redeemed
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs sm:text-sm text-neutral-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatDate(transaction.date)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{formatTime(transaction.date)}</span>
                            </span>
                            <span className="bg-neutral-100 px-2 py-1 rounded text-xs self-start sm:self-auto">
                              {transaction.voucher_type ? transaction.voucher_type.replace('_', ' ').toUpperCase() : transaction.category}
                            </span>
                            {transaction.redemption_type && (
                              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs self-start sm:self-auto">
                                {transaction.redemption_type}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-1 truncate">
                            Ref: {transaction.reference}
                          </p>
                          {transaction.title && (
                            <p className="text-xs text-neutral-500 mt-1 truncate">
                              {transaction.title}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className={`font-bold text-base sm:text-lg ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                        </p>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <CreditCard className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No transactions found</h3>
                  <p className="text-neutral-600">
                    {searchTerm || selectedType !== 'all' || selectedStatus !== 'all' 
                      ? 'Try adjusting your search or filters' 
                      : 'You haven\'t made any transactions yet'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>


      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};



export default Transactions; 