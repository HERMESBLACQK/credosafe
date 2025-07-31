import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVouchers } from '../store/slices/voucherSlice';
import apiService from '../api';
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
  const { user: _user } = useSelector((state) => state.auth);
  const { vouchers } = useSelector((state) => state.vouchers);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [userBalance, setUserBalance] = useState(0);
  const [isLoadingBalance, setIsLoadingBalance] = useState(true);
  const [themes, setThemes] = useState({});
  const [loadingThemes, setLoadingThemes] = useState(false);

  useEffect(() => {
    dispatch(fetchVouchers());

    // Fetch user's wallet balance
    const fetchBalance = async () => {
      try {
        setIsLoadingBalance(true);
        const response = await apiService.vouchers.getBalance();
        if (response.success) {
          setUserBalance(response.data?.balance || 0);
        } else {
          console.error('Failed to fetch balance:', response.error);
          setUserBalance(0);
        }
      } catch (error) {
        console.error('Balance fetch error:', error);
        setUserBalance(0);
      } finally {
        setIsLoadingBalance(false);
      }
    };

    // Fetch themes for all voucher types
    const fetchThemes = async () => {
      try {
        setLoadingThemes(true);
        const voucherTypes = ['gift_card', 'work_order', 'purchase_escrow', 'prepaid'];
        const themesData = {};
        
        for (const voucherType of voucherTypes) {
          const response = await apiService.themes.getByVoucherType(voucherType);
          console.log(`🎨 Fetched themes for ${voucherType}:`, response);
          if (response.success) {
            themesData[voucherType] = response.data || [];
          }
        }
        
        console.log('🎨 All themes data:', themesData);
        setThemes(themesData);
      } catch (error) {
        console.error('Themes fetch error:', error);
      } finally {
        setLoadingThemes(false);
      }
    };

    fetchBalance();
    fetchThemes();
  }, [dispatch]);

  // Convert vouchers to transaction format for display
  const transactions = useMemo(() => vouchers.map(voucher => ({
    id: voucher.id,
    type: 'funding',
    amount: parseFloat(voucher.total_amount),
    description: `${voucher.type.replace('-', ' ').toUpperCase()} Voucher Created`,
    date: voucher.created_at,
    status: voucher.status,
    reference: voucher.voucher_code,
    category: voucher.type.replace('-', ' ').toUpperCase(),
    voucherType: voucher.type,
    voucherData: voucher
  })), [vouchers]);

  const [filteredTransactions, setFilteredTransactions] = useState([]);

  // Filter transactions based on search and filters
  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase())
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
    return type === 'funding' ? 
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



  const getVoucherTheme = (voucherType, themeName) => {
    // Map voucher types to theme types
    const themeTypeMap = {
      'work-order': 'work_order',
      'purchase_escrow': 'purchase_escrow',
      'gift-card': 'gift_card',
      'prepaid': 'prepaid'
    };
    
    const themeType = themeTypeMap[voucherType] || voucherType;
    
    console.log(`🎨 Looking for theme: voucherType=${voucherType}, themeType=${themeType}, themeName=${themeName}`);
    console.log(`🎨 Available themes for ${themeType}:`, themes[themeType]);
    
    if (!themes[themeType] || !Array.isArray(themes[themeType])) {
      console.log(`🎨 No themes found for ${themeType}`);
      return null;
    }
    
    // If themeName is provided, try to find it
    if (themeName) {
      const foundTheme = themes[themeType].find(t => t.name === themeName);
      if (foundTheme) {
        console.log(`🎨 Found specific theme:`, foundTheme);
        return foundTheme;
      }
    }
    
    // Return first available theme for this type
    const firstTheme = themes[themeType][0] || null;
    console.log(`🎨 Using first theme:`, firstTheme);
    return firstTheme;
  };

  const getVoucherThemeBackground = (voucherType, themeName = null) => {
    const theme = getVoucherTheme(voucherType, themeName);
    if (theme) {
      return `bg-gradient-to-br ${theme.gradient_colors}`;
    }
    
    // Fallback backgrounds when no theme is available
    switch (voucherType) {
      case 'work-order':
        return 'bg-gradient-to-br from-blue-500 to-blue-600';
      case 'escrow':
      case 'purchase_escrow':
        return 'bg-gradient-to-br from-green-500 to-green-600';
      case 'gift-card':
        return 'bg-gradient-to-br from-pink-500 to-purple-600';
      case 'prepaid':
        return 'bg-gradient-to-br from-purple-500 to-purple-600';
      default:
        return 'bg-gradient-to-br from-gray-500 to-gray-600';
    }
  };

  const getVoucherIcon = (voucherType, themeName = null) => {
    const theme = getVoucherTheme(voucherType, themeName);
    if (theme) {
      return <span className="text-2xl">{theme.icon_emoji}</span>;
    }
    
    // Fallback icons
    switch (voucherType) {
      case 'work-order':
        return <Handshake className="w-8 h-8 text-white" />;
      case 'escrow':
      case 'purchase_escrow':
        return <Lock className="w-8 h-8 text-white" />;
      case 'gift-card':
        return <Gift className="w-8 h-8 text-white" />;
      case 'prepaid':
        return <CreditCard className="w-8 h-8 text-white" />;
      default:
        return <CreditCard className="w-8 h-8 text-white" />;
    }
  };

  const getVoucherTitle = (voucherType) => {
    switch (voucherType) {
      case 'work-order':
        return 'Work Order Voucher';
      case 'escrow':
      case 'purchase_escrow':
        return 'Escrow Voucher';
      case 'gift-card':
        return 'Gift Card';
      case 'prepaid':
        return 'Prepaid Voucher';
      default:
        return 'Voucher';
    }
  };

  const getVoucherSubtitle = (voucherType) => {
    switch (voucherType) {
      case 'work-order':
        return 'CredoSafe Secure Transaction';
      case 'escrow':
      case 'purchase_escrow':
        return 'Secure Transaction Protection';
      case 'gift-card':
        return 'CredoSafe Digital Gift';
      case 'prepaid':
        return 'Digital Wallet Credit';
      default:
        return 'CredoSafe Voucher';
    }
  };



  const getTypeColor = (type) => {
    return type === 'funding' ? 'text-green-600' : 'text-red-600';
  };

  const handleVoucherClick = (transaction) => {
    if (transaction.voucherData) {
      // Navigate to the voucher preview page
      navigate(`/voucher-preview/${transaction.voucherData.id}`);
    }
  };



  const totalIncome = transactions
    .filter(t => t.type === 'funding' && (t.status === 'completed' || t.status === 'active'))
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'withdrawal' && (t.status === 'completed' || t.status === 'active'))
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-neutral-900">
                  {showBalance ? (isLoadingBalance ? 'Loading...' : formatCurrency(currentBalance)) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {showBalance ? formatCurrency(totalIncome) : '••••••'}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-neutral-600 mb-1">Total Expenses</p>
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
              </div>
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
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className={`p-6 transition-colors ${
                      transaction.voucherData ? 'hover:bg-neutral-50 cursor-pointer' : 'hover:bg-neutral-50'
                    }`}
                    onClick={() => transaction.voucherData && handleVoucherClick(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-neutral-900">
                              {transaction.description}
                            </p>
                            {transaction.voucherData && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                                Click to view voucher
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(transaction.date)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(transaction.date)}</span>
                            </span>
                            <span className="bg-neutral-100 px-2 py-1 rounded text-xs">
                              {transaction.category}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            Ref: {transaction.reference}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold text-lg ${getTypeColor(transaction.type)}`}>
                          {transaction.type === 'funding' ? '+' : ''}{formatCurrency(transaction.amount)}
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