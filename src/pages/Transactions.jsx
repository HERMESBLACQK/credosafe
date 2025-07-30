import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
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
  const { user: _user } = useSelector((state) => state.auth);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showBalance, setShowBalance] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherModal, setShowVoucherModal] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Enhanced transaction data with detailed voucher information
  const [transactions, _setTransactions] = useState([
    {
      id: '1',
      type: 'funding',
      amount: 500.00,
      description: 'Work Order Voucher Created',
      date: '2024-01-15T10:30:00Z',
      status: 'active',
      reference: 'WO-001',
      category: 'Work Order',
      voucherType: 'work-order',
      voucherData: {
        projectTitle: 'Website Development',
        clientName: 'John Smith',
        clientEmail: 'john@example.com',
        totalAmount: 500.00,
        paymentType: 'milestone',
        milestones: [
          { name: 'Design Phase', amount: 200.00, percentage: 40, status: 'pending' },
          { name: 'Development Phase', amount: 200.00, percentage: 40, status: 'pending' },
          { name: 'Testing & Launch', amount: 100.00, percentage: 20, status: 'pending' }
        ],
        description: 'Complete website development with responsive design',
        dueDate: '2024-02-15',
        terms: 'Payment released upon milestone completion'
      }
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: -150.25,
      description: 'Work Order Milestone Payment',
      date: '2024-01-14T14:20:00Z',
      status: 'completed',
      reference: 'WO-001-M1',
      category: 'Work Order',
      voucherType: 'work-order',
      voucherData: {
        projectTitle: 'Website Development',
        clientName: 'John Smith',
        milestone: 'Design Phase',
        amount: 150.25,
        status: 'completed',
        completionDate: '2024-01-14'
      }
    },
    {
      id: '3',
      type: 'funding',
      amount: 750.00,
      description: 'Purchase Escrow Voucher Created',
      date: '2024-01-13T09:15:00Z',
      status: 'active',
      reference: 'ESC-001',
      category: 'Escrow',
      voucherType: 'escrow',
      voucherData: {
        itemTitle: 'MacBook Pro 2023',
        sellerName: 'Alice Johnson',
        sellerEmail: 'alice@example.com',
        buyerName: 'Bob Wilson',
        buyerEmail: 'bob@example.com',
        itemDescription: 'MacBook Pro 14-inch, M2 Pro, 16GB RAM, 512GB SSD',
        itemValue: 750.00,
        escrowFee: 2.5,
        inspectionPeriod: 7,
        returnPolicy: 14,
        shippingMethod: 'express',
        terms: 'Item must be in original condition',
        paymentStatus: 'pending'
      }
    },
    {
      id: '4',
      type: 'withdrawal',
      amount: -200.00,
      description: 'Escrow Payment Released',
      date: '2024-01-12T16:45:00Z',
      status: 'completed',
      reference: 'ESC-001-REL',
      category: 'Escrow',
      voucherType: 'escrow',
      voucherData: {
        itemTitle: 'MacBook Pro 2023',
        sellerName: 'Alice Johnson',
        buyerName: 'Bob Wilson',
        amount: 200.00,
        releaseReason: 'Buyer approved after inspection period',
        releaseDate: '2024-01-12'
      }
    },
    {
      id: '5',
      type: 'funding',
      amount: 300.00,
      description: 'Gift Card Voucher Created',
      date: '2024-01-11T11:30:00Z',
      status: 'completed',
      reference: 'GC-001',
      category: 'Gift Card',
      voucherType: 'gift-card',
      voucherData: {
        giftAmount: 300.00,
        recipientName: 'Sarah Davis',
        recipientEmail: 'sarah@example.com',
        senderName: 'Mike Brown',
        senderEmail: 'mike@example.com',
        message: 'Happy Birthday! Hope you enjoy your special day!',
        isAnonymous: false,
        deliveryMethod: 'email',
        theme: 'birthday',
        design: 'Birthday Celebration'
      }
    },
    {
      id: '6',
      type: 'withdrawal',
      amount: -75.50,
      description: 'Prepaid Voucher Usage',
      date: '2024-01-10T13:20:00Z',
      status: 'completed',
      reference: 'PP-001',
      category: 'Prepaid',
      voucherType: 'prepaid',
      voucherData: {
        voucherAmount: 100.00,
        recipientName: 'Emma Wilson',
        recipientEmail: 'emma@example.com',
        businessCategory: 'restaurants',
        remainingBalance: 24.50,
        usageAmount: 75.50,
        businessName: 'Pizza Palace',
        usageDate: '2024-01-10',
        expiryDate: '2024-06-10',
        autoReload: true,
        reloadAmount: 100.00,
        reloadFrequency: 'monthly'
      }
    },
    {
      id: '7',
      type: 'funding',
      amount: 250.00,
      description: 'Prepaid Voucher Created',
      date: '2024-01-09T08:45:00Z',
      status: 'active',
      reference: 'PP-002',
      category: 'Prepaid',
      voucherType: 'prepaid',
      voucherData: {
        voucherAmount: 250.00,
        recipientName: 'David Lee',
        recipientEmail: 'david@example.com',
        businessCategory: 'all',
        remainingBalance: 250.00,
        expiryDate: '2024-12-31',
        message: 'Enjoy shopping!',
        autoReload: false
      }
    },
    {
      id: '8',
      type: 'funding',
      amount: 1000.00,
      description: 'Work Order Full Payment',
      date: '2024-01-08T15:30:00Z',
      status: 'completed',
      reference: 'WO-002',
      category: 'Work Order',
      voucherType: 'work-order',
      voucherData: {
        projectTitle: 'Mobile App Development',
        clientName: 'Tech Startup Inc',
        clientEmail: 'contact@techstartup.com',
        totalAmount: 1000.00,
        paymentType: 'full',
        description: 'iOS and Android mobile application development',
        dueDate: '2024-03-08',
        terms: 'Full payment upfront for project completion'
      }
    }
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState(transactions);

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const getVoucherIcon = (voucherType) => {
    switch (voucherType) {
      case 'work-order':
        return <Handshake className="w-6 h-6" />;
      case 'escrow':
        return <Lock className="w-6 h-6" />;
      case 'gift-card':
        return <Gift className="w-6 h-6" />;
      case 'prepaid':
        return <CreditCard className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
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

  const handleReleaseMilestone = (transaction) => {
    console.log('Releasing milestone for:', transaction.reference);
    // In a real app, this would trigger milestone release
  };

  const handleMakePayment = (transaction) => {
    console.log('Making payment for:', transaction.reference);
    // In a real app, this would trigger payment process
  };

  const handleDrainVoucher = (transaction) => {
    console.log('Draining voucher for:', transaction.reference);
    // In a real app, this would trigger voucher drainage
  };

  const getTypeColor = (type) => {
    return type === 'funding' ? 'text-green-600' : 'text-red-600';
  };

  const handleVoucherClick = (transaction) => {
    if (transaction.voucherData) {
      setSelectedVoucher(transaction);
      setShowVoucherModal(true);
    }
  };

  const handleDownloadVoucher = () => {
    // Simulate download functionality
    console.log('Downloading voucher:', selectedVoucher?.reference);
    // In a real app, this would generate and download a PDF
  };

  const handleShareVoucher = () => {
    // Simulate share functionality
    console.log('Sharing voucher:', selectedVoucher?.reference);
    // In a real app, this would open share dialog
  };

  const totalIncome = transactions
    .filter(t => t.type === 'funding' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const currentBalance = totalIncome - totalExpenses;

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
                  {showBalance ? formatCurrency(currentBalance) : '••••••'}
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
                  </motion.div>
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
        </motion.div>
      </div>

      {/* Voucher Details Modal */}
      {showVoucherModal && selectedVoucher && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-large max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  {getVoucherIcon(selectedVoucher.voucherType)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-neutral-900">
                    {selectedVoucher.category} Voucher Details
                  </h2>
                  <p className="text-sm text-neutral-600">Ref: {selectedVoucher.reference}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownloadVoucher}
                  className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Download Voucher"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={handleShareVoucher}
                  className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Share Voucher"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Voucher Preview */}
              <div className="mb-6">
                {selectedVoucher.voucherType === 'work-order' && (
                  <WorkOrderVoucherPreview 
                    voucherData={selectedVoucher.voucherData} 
                    transaction={selectedVoucher}
                    onReleaseMilestone={handleReleaseMilestone}
                  />
                )}
                {selectedVoucher.voucherType === 'escrow' && (
                  <EscrowVoucherPreview 
                    voucherData={selectedVoucher.voucherData} 
                    transaction={selectedVoucher}
                    onMakePayment={handleMakePayment}
                  />
                )}
                {selectedVoucher.voucherType === 'gift-card' && (
                  <GiftCardVoucherPreview voucherData={selectedVoucher.voucherData} />
                )}
                {selectedVoucher.voucherType === 'prepaid' && (
                  <PrepaidVoucherPreview 
                    voucherData={selectedVoucher.voucherData}
                    transaction={selectedVoucher}
                    onDrainVoucher={handleDrainVoucher}
                  />
                )}
              </div>

              {/* Transaction Details */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <h3 className="font-semibold text-neutral-900 mb-3">Transaction Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-600">Transaction Type</p>
                    <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.type}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Amount</p>
                    <p className="font-medium text-neutral-900">{formatCurrency(selectedVoucher.amount)}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Status</p>
                    <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.status}</p>
                  </div>
                  <div>
                    <p className="text-neutral-600">Date</p>
                    <p className="font-medium text-neutral-900">{formatDate(selectedVoucher.date)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

// Voucher Preview Components
const WorkOrderVoucherPreview = ({ voucherData, transaction, onReleaseMilestone }) => {
  const calculateTotal = () => {
    if (voucherData.paymentType === 'full') {
      return parseFloat(voucherData.totalAmount) || 0;
    }
    return voucherData.milestones?.reduce((sum, milestone) => {
      return sum + (parseFloat(milestone.amount) || 0);
    }, 0) || 0;
  };

  const pendingMilestones = voucherData.milestones?.filter(m => m.status === 'pending') || [];

  return (
    <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Handshake className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">Work Order Voucher</h3>
        <p className="text-neutral-600">CredoSafe Secure Transaction</p>
      </div>

      <div className="space-y-4">
        <div className="border-b border-neutral-200 pb-4">
          <h4 className="font-semibold text-neutral-900 mb-2">Project Details</h4>
          <p className="text-neutral-700">{voucherData.projectTitle}</p>
          <p className="text-sm text-neutral-600">{voucherData.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600">Client</p>
            <p className="font-medium text-neutral-900">{voucherData.clientName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Amount</p>
            <p className="font-bold text-blue-600">${calculateTotal().toFixed(2)}</p>
          </div>
        </div>

        {voucherData.paymentType === 'milestone' && voucherData.milestones && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-2">Milestones</h4>
            <div className="space-y-2">
              {voucherData.milestones.map((milestone, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <span>{milestone.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                      milestone.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {milestone.status}
                    </span>
                  </div>
                  <span className="font-medium">${milestone.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Button for Active Work Orders */}
        {transaction?.status === 'active' && voucherData.paymentType === 'milestone' && pendingMilestones.length > 0 && (
          <div className="border-t border-neutral-200 pt-4">
            <button
              onClick={() => onReleaseMilestone(transaction)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Release Milestone Fund</span>
            </button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              {pendingMilestones.length} milestone(s) pending release
            </p>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Voucher ID: WO-{Date.now().toString().slice(-8)}</p>
          <p className="text-xs text-neutral-500">Created: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const EscrowVoucherPreview = ({ voucherData, transaction, onMakePayment }) => {
  const calculateEscrowFee = () => {
    const value = parseFloat(voucherData.itemValue) || 0;
    const feePercentage = parseFloat(voucherData.escrowFee) || 0;
    return (value * feePercentage) / 100;
  };

  const calculateTotal = () => {
    const value = parseFloat(voucherData.itemValue) || 0;
    const fee = calculateEscrowFee();
    return value + fee;
  };

  return (
    <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">Escrow Voucher</h3>
        <p className="text-neutral-600">Secure Transaction Protection</p>
      </div>

      <div className="space-y-4">
        <div className="border-b border-neutral-200 pb-4">
          <h4 className="font-semibold text-neutral-900 mb-2">Item Details</h4>
          <p className="text-neutral-700">{voucherData.itemTitle}</p>
          <p className="text-sm text-neutral-600">{voucherData.itemDescription}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600">Seller</p>
            <p className="font-medium text-neutral-900">{voucherData.sellerName}</p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Buyer</p>
            <p className="font-medium text-neutral-900">{voucherData.buyerName}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium text-neutral-900">Item Value:</span>
            <span className="font-bold text-green-600">${parseFloat(voucherData.itemValue) || 0}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-neutral-600">Escrow Fee ({voucherData.escrowFee}%):</span>
            <span className="text-sm font-medium">${calculateEscrowFee().toFixed(2)}</span>
          </div>
          <div className="border-t border-neutral-200 pt-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-neutral-900">Total:</span>
              <span className="text-lg font-bold text-green-600">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Button for Active Escrow */}
        {transaction?.status === 'active' && voucherData.paymentStatus === 'pending' && (
          <div className="border-t border-neutral-200 pt-4">
            <button
              onClick={() => onMakePayment(transaction)}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
            >
              <DollarSign className="w-5 h-5" />
              <span>Make Payment</span>
            </button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Payment pending - Click to complete transaction
            </p>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Voucher ID: ESC-{Date.now().toString().slice(-8)}</p>
          <p className="text-xs text-neutral-500">Created: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const GiftCardVoucherPreview = ({ voucherData }) => {
  const giftCardDesigns = [
    { theme: 'birthday', colors: 'from-pink-500 to-purple-600', icon: <Sparkles className="w-8 h-8" /> },
    { theme: 'holiday', colors: 'from-red-500 to-green-600', icon: <Heart className="w-8 h-8" /> },
    { theme: 'elegant', colors: 'from-yellow-500 to-orange-600', icon: <Star className="w-8 h-8" /> },
    { theme: 'ocean', colors: 'from-blue-500 to-cyan-600', icon: <Gift className="w-8 h-8" /> },
    { theme: 'nature', colors: 'from-green-500 to-emerald-600', icon: <Gift className="w-8 h-8" /> },
    { theme: 'sunset', colors: 'from-orange-500 to-pink-600', icon: <Sparkles className="w-8 h-8" /> }
  ];

  const selectedDesign = giftCardDesigns.find(d => d.theme === voucherData.theme) || giftCardDesigns[0];

  return (
    <div className={`border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br ${selectedDesign.colors} text-white`}>
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="text-white">
            {selectedDesign.icon}
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">Gift Card</h3>
        <p className="text-white/80">CredoSafe Digital Gift</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white/20 rounded-lg p-4 text-center">
          <p className="text-white/80 mb-1">Gift Amount</p>
          <p className="text-3xl font-bold">
            ${parseFloat(voucherData.giftAmount) || 0}
          </p>
        </div>

        <div className="border-t border-white/20 pt-4">
          <h4 className="font-semibold mb-2">To:</h4>
          <p className="font-medium">{voucherData.recipientName}</p>
        </div>

        {!voucherData.isAnonymous && voucherData.senderName && (
          <div>
            <h4 className="font-semibold mb-2">From:</h4>
            <p className="font-medium">{voucherData.senderName}</p>
          </div>
        )}

        {voucherData.message && (
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Message:</p>
            <p className="italic">"{voucherData.message}"</p>
          </div>
        )}

        <div className="border-t border-white/20 pt-4">
          <p className="text-xs text-white/60">Gift Card ID: GC-{Date.now().toString().slice(-8)}</p>
          <p className="text-xs text-white/60">Created: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

const PrepaidVoucherPreview = ({ voucherData, transaction, onDrainVoucher }) => {
  return (
    <div className="border-2 border-neutral-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-neutral-900">Prepaid Voucher</h3>
        <p className="text-neutral-600">Digital Wallet Credit</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white rounded-lg p-4 text-center">
          <p className="text-sm text-neutral-600 mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-purple-600">
            ${parseFloat(voucherData.remainingBalance || voucherData.voucherAmount) || 0}
          </p>
        </div>

        <div className="border-b border-neutral-200 pb-4">
          <h4 className="font-semibold text-neutral-900 mb-2">Recipient</h4>
          <p className="text-neutral-700">{voucherData.recipientName}</p>
          {voucherData.recipientEmail && (
            <p className="text-sm text-neutral-600">{voucherData.recipientEmail}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-600">Category</p>
            <p className="font-medium text-neutral-900">
              {voucherData.businessCategory === 'all' ? 'All Businesses' : voucherData.businessCategory}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-600">Expires</p>
            <p className="font-medium text-neutral-900">
              {voucherData.expiryDate ? new Date(voucherData.expiryDate).toLocaleDateString() : 'No expiry'}
            </p>
          </div>
        </div>

        {voucherData.autoReload && (
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Auto-Reload Enabled</span>
            </div>
            <p className="text-sm text-blue-700">
              ${voucherData.reloadAmount || 0} every {voucherData.reloadFrequency}
            </p>
          </div>
        )}

        {/* Action Button for Active Prepaid Vouchers */}
        {transaction?.status === 'active' && parseFloat(voucherData.remainingBalance || voucherData.voucherAmount) > 0 && (
          <div className="border-t border-neutral-200 pt-4">
            <button
              onClick={() => onDrainVoucher(transaction)}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Drain Voucher</span>
            </button>
            <p className="text-xs text-neutral-500 mt-2 text-center">
              Available balance: ${parseFloat(voucherData.remainingBalance || voucherData.voucherAmount).toFixed(2)}
            </p>
          </div>
        )}

        <div className="border-t border-neutral-200 pt-4">
          <p className="text-xs text-neutral-500">Voucher ID: PP-{Date.now().toString().slice(-8)}</p>
          <p className="text-xs text-neutral-500">Created: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Transactions; 