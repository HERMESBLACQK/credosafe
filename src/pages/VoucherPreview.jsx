import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import { useError } from '../contexts/ErrorContext';
import apiService from '../api/index';
import { showSuccess, showError } from '../utils/toast';
import { 
  Shield, 
  ArrowLeft,
  Download,
  Share2,
  X,
  Handshake,
  Lock,
  Gift,
  CreditCard,
  Eye,
  EyeOff,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';


const VoucherPreview = () => {
  const { id: voucherId } = useParams();
  const navigate = useNavigate();
  const { vouchers = [] } = useSelector((state) => state.vouchers);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [themes, setThemes] = useState({});
  const [loadingThemes, setLoadingThemes] = useState(false);
  const [isReleasingMilestone, setIsReleasingMilestone] = useState(false);
  const [isActivatingVoucher, setIsActivatingVoucher] = useState(false);
  const [isCancellingVoucher, setIsCancellingVoucher] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');


  useEffect(() => {
    console.log('🔍 VoucherPreview useEffect triggered');
    console.log('🔍 voucherId from params:', voucherId);
    console.log('🔍 vouchers from Redux:', vouchers);
    console.log('🔍 vouchers length:', vouchers?.length);
    
    // Find the voucher by ID (voucherId is a UUID string, not integer)
    const voucher = vouchers.find(v => v.id === voucherId);
    console.log('🔍 Found voucher in Redux:', voucher);
    
    if (voucher) {
      console.log('✅ Using voucher from Redux store');
      console.log('📋 Voucher details:', voucher);
      setSelectedVoucher({
        id: voucher.id,
        type: 'funding',
        amount: parseFloat(voucher.total_amount),
        description: `${voucher.type ? voucher.type.replace('-', ' ').toUpperCase() : 'Voucher'} Voucher Created`,
        date: voucher.created_at,
        status: voucher.status,
        reference: voucher.voucher_code,
        category: voucher.type ? voucher.type.replace('-', ' ').toUpperCase() : 'Voucher',
        voucherType: voucher.type,
        voucherData: voucher
      });
    } else {
      console.log('❌ Voucher not found in Redux store, fetching from API');
      // If voucher not found in Redux store, fetch it from API
      fetchVoucherFromAPI();
    }

    // Fetch themes for all voucher types
    const fetchThemes = async () => {
      try {
        console.log('🎨 Fetching themes for voucher types');
        setLoadingThemes(true);
        const voucherTypes = ['gift_card', 'work_order', 'purchase_escrow', 'prepaid'];
        const themesData = {};
        
        for (const voucherType of voucherTypes) {
          console.log(`🎨 Fetching themes for ${voucherType}`);
          const response = await apiService.themes.getByVoucherType(voucherType);
          console.log(`🎨 ${voucherType} themes response:`, response);
          if (response.success) {
            themesData[voucherType] = response.data || [];
            console.log(`🎨 ${voucherType} themes data:`, themesData[voucherType]);
          }
        }
        
        console.log('🎨 All themes data:', themesData);
        setThemes(themesData);
      } catch (error) {
        console.error('❌ Themes fetch error:', error);
      } finally {
        setLoadingThemes(false);
      }
    };

    fetchThemes();
  }, [voucherId, vouchers]);

  const fetchVoucherFromAPI = async () => {
    try {
      if (!voucherId) {
        console.error('❌ No voucher ID provided');
        navigate('/transactions');
        return;
      }
      
      console.log('🔍 Fetching voucher from API with ID:', voucherId);
      const response = await apiService.vouchers.getById(voucherId);
      
      console.log('📡 Server response:', response);
      console.log('📡 Response success:', response.success);
      console.log('📡 Response message:', response.message);
      console.log('📡 Response data:', response.data);
      
      if (response.success) {
        const voucher = response.data;
        console.log('✅ Voucher data received:', voucher);
        console.log('📋 Voucher type:', voucher.type);
        console.log('💰 Total amount:', voucher.total_amount);
        console.log('📋 Milestones:', voucher.milestones);
        console.log('📋 Milestones length:', voucher.milestones?.length);
        
        setSelectedVoucher({
          id: voucher.id,
          type: 'funding',
          amount: parseFloat(voucher.total_amount),
          description: `${voucher.type ? voucher.type.replace('-', ' ').toUpperCase() : 'Voucher'} Voucher Created`,
          date: voucher.created_at,
          status: voucher.status,
          reference: voucher.voucher_code,
          category: voucher.type ? voucher.type.replace('-', ' ').toUpperCase() : 'Voucher',
          voucherType: voucher.type,
          voucherData: voucher
        });
      } else {
        console.error('❌ Failed to fetch voucher:', response.message);
        console.error('❌ Response error details:', response);
        navigate('/transactions');
      }
    } catch (error) {
      console.error('❌ Voucher fetch error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      navigate('/transactions');
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'active':
      case 'available':
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
    const themeTypeMap = {
      'work-order': 'work_order',
      'work_order': 'work_order',
      'purchase_escrow': 'purchase_escrow',
      'gift-card': 'gift_card',
      'gift_card': 'gift_card',
      'prepaid': 'prepaid'
    };
    
    const themeType = themeTypeMap[voucherType] || voucherType;
    
    if (!themes[themeType] || !Array.isArray(themes[themeType])) {
      return null;
    }
    
    if (themeName) {
      const foundTheme = themes[themeType].find(t => t.name === themeName);
      if (foundTheme) {
        return foundTheme;
      }
    }
    
    return themes[themeType][0] || null;
  };

  const getVoucherThemeBackground = (voucherType, themeName = null) => {
    const theme = getVoucherTheme(voucherType, themeName);
    if (theme) {
      return `bg-gradient-to-br ${theme.gradient_colors}`;
    }
    
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

  const handleDownloadVoucher = () => {
    console.log('Downloading voucher:', selectedVoucher?.reference);
  };

  const handleShareVoucher = () => {
    console.log('Sharing voucher:', selectedVoucher?.reference);
  };

  const handleReleaseMilestone = async () => {
    if (!selectedVoucher?.voucherData?.id) return;
    
    setIsReleasingMilestone(true);
    try {
      console.log('🔍 Releasing milestone for voucher:', selectedVoucher.voucherData.id);
      const response = await apiService.vouchers.releaseMilestone(selectedVoucher.voucherData.id);
      
      console.log('📡 Release milestone response:', response);
      
      if (response.success) {
        console.log('✅ Milestone released successfully');
        showSuccess(`Milestone "${response.data.milestoneName}" released successfully! Amount: ${formatCurrency(response.data.amount)}`);
        
        // Refresh the voucher data
        if (selectedVoucher.voucherData.id) {
          const voucherResponse = await apiService.vouchers.getById(selectedVoucher.voucherData.id);
          if (voucherResponse.success) {
            setSelectedVoucher(prev => ({
              ...prev,
              voucherData: voucherResponse.data
            }));
          }
        }
      } else {
        console.error('❌ Failed to release milestone:', response.message);
        showError(`Failed to release milestone: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Error releasing milestone:', error);
      showError('Error releasing milestone. Please try again.');
    } finally {
      setIsReleasingMilestone(false);
    }
  };

  const handleActivateVoucher = async () => {
    if (!selectedVoucher?.voucherData?.id) return;
    
    setIsActivatingVoucher(true);
    try {
      console.log('🔍 Activating voucher:', selectedVoucher.voucherData.id);
      const response = await apiService.vouchers.activateVoucher(selectedVoucher.voucherData.id);
      
      console.log('📡 Activate voucher response:', response);
      
      if (response.success) {
        console.log('✅ Voucher activated successfully');
        showSuccess('Voucher activated successfully!');
        
        // Refresh the voucher data
        if (selectedVoucher.voucherData.id) {
          const voucherResponse = await apiService.vouchers.getById(selectedVoucher.voucherData.id);
          if (voucherResponse.success) {
            setSelectedVoucher(prev => ({
              ...prev,
              voucherData: voucherResponse.data
            }));
          }
        }
      } else {
        console.error('❌ Failed to activate voucher:', response.message);
        showError(`Failed to activate voucher: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Error activating voucher:', error);
      showError('Error activating voucher. Please try again.');
    } finally {
      setIsActivatingVoucher(false);
    }
  };

  const handleCancelVoucher = async () => {
    if (!selectedVoucher?.voucherData?.id) return;
    
    setIsCancellingVoucher(true);
    try {
      console.log('🔍 Cancelling voucher:', selectedVoucher.voucherData.id);
      const response = await apiService.vouchers.cancelVoucher(selectedVoucher.voucherData.id, cancelReason);
      
      console.log('📡 Cancel voucher response:', response);
      
      if (response.success) {
        console.log('✅ Voucher cancellation initiated successfully');
        showSuccess('Voucher cancellation initiated successfully! Recipient has been notified.');
        setShowCancelModal(false);
        setCancelReason('');
        
        // Refresh the voucher data
        if (selectedVoucher.voucherData.id) {
          const voucherResponse = await apiService.vouchers.getById(selectedVoucher.voucherData.id);
          if (voucherResponse.success) {
            setSelectedVoucher(prev => ({
              ...prev,
              voucherData: voucherResponse.data
            }));
          }
        }
      } else {
        console.error('❌ Failed to cancel voucher:', response.message);
        showError(`Failed to cancel voucher: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Error cancelling voucher:', error);
      showError('Error cancelling voucher. Please try again.');
    } finally {
      setIsCancellingVoucher(false);
    }
  };

  const handleResolveDispute = async () => {
    if (!selectedVoucher?.voucherData?.id) return;
    
    try {
      console.log('🔍 Resolving dispute for voucher:', selectedVoucher.voucherData.id);
      
      let response;
      if (selectedVoucher.voucherType === 'work_order') {
        response = await apiService.vouchers.releaseMilestone(selectedVoucher.voucherData.id);
      } else if (selectedVoucher.voucherType === 'purchase_escrow') {
        response = await apiService.vouchers.activateVoucher(selectedVoucher.voucherData.id);
      }
      
      console.log('📡 Resolve dispute response:', response);
      
      if (response.success) {
        console.log('✅ Dispute resolved successfully');
        showSuccess('Dispute resolved successfully! Voucher is now available for redemption.');
        
        // Refresh the voucher data
        if (selectedVoucher.voucherData.id) {
          const voucherResponse = await apiService.vouchers.getById(selectedVoucher.voucherData.id);
          if (voucherResponse.success) {
            setSelectedVoucher(prev => ({
              ...prev,
              voucherData: voucherResponse.data
            }));
          }
        }
      } else {
        console.error('❌ Failed to resolve dispute:', response.message);
        showError(`Failed to resolve dispute: ${response.message}`);
      }
    } catch (error) {
      console.error('❌ Error resolving dispute:', error);
      showError('Error resolving dispute. Please try again.');
    }
  };

  if (!selectedVoucher) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading voucher details...</p>
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/transactions')}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
                <span>Back to Transactions</span>
              </button>
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
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {selectedVoucher.category} Voucher Details
            </h1>
            <p className="text-neutral-600">Ref: {selectedVoucher.reference}</p>
          </div>

          {/* Loading indicator for themes */}
          {loadingThemes && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-neutral-600 mt-2">Loading voucher theme...</p>
            </div>
          )}
          
          {/* Voucher Status Alert */}
          {selectedVoucher.voucherData.status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Voucher in Dispute Mode</h3>
                  <p className="text-yellow-800 text-sm">
                    This voucher is currently in dispute mode. Please contact admin support if the dispute has not been resolved yet.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Dispute Status Alert */}
          {selectedVoucher.voucherData.dispute_status === '1' && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">Cancellation Requested</h3>
                  <p className="text-orange-800 text-sm mb-4">
                    You have requested to cancel this voucher. The recipient has been notified and can confirm the cancellation.
                  </p>
                  {selectedVoucher.voucherData.dispute_reason && (
                    <div className="bg-orange-100 rounded-lg p-3">
                      <p className="text-sm font-medium text-orange-900 mb-1">Your reason for cancellation:</p>
                      <p className="text-sm text-orange-800 italic">"{selectedVoucher.voucherData.dispute_reason}"</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Voucher Details */}
          <div className="space-y-6">
            {/* Voucher Preview Card */}
            <div className={`border-2 border-neutral-200 rounded-lg p-6 ${getVoucherThemeBackground(selectedVoucher.voucherType, selectedVoucher.voucherData.theme)} text-white`}>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {getVoucherIcon(selectedVoucher.voucherType, selectedVoucher.voucherData.theme)}
                </div>
                <h3 className="text-2xl font-bold mb-2">{getVoucherTitle(selectedVoucher.voucherType)}</h3>
                <p className="text-white/80">{getVoucherSubtitle(selectedVoucher.voucherType)}</p>
              </div>

              <div className="space-y-4">
                {/* Amount Display */}
                <div className="bg-white/20 rounded-lg p-4 text-center">
                  <p className="text-white/80 mb-1">
                    {selectedVoucher.voucherType === 'gift-card' ? 'Gift Amount' : 
                     selectedVoucher.voucherType === 'prepaid' ? 'Available Balance' : 'Available Amount'}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(selectedVoucher.voucherData.available_amount || selectedVoucher.voucherData.total_amount || 0)}
                  </p>
                </div>

                {/* Voucher Code and Barcode */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/80 mb-1">Voucher Code</p>
                    <p className="font-mono text-sm font-medium text-white bg-white/20 px-3 py-2 rounded border">
                      {selectedVoucher.voucherData.voucher_code || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/80 mb-1">Barcode</p>
                    <p className="font-mono text-sm font-medium text-white bg-white/20 px-3 py-2 rounded border">
                      {selectedVoucher.voucherData.barcode || 'N/A'}
                    </p>
                  </div>
                  </div>

                {/* Status */}
                <div className="text-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(selectedVoucher.voucherData.status)}`}>
                    {selectedVoucher.voucherData.status || 'N/A'}
                  </span>
                  </div>

                {/* Footer */}
                <div className="border-t border-white/20 pt-4">
                  <p className="text-xs text-white/60">
                    Voucher ID: {selectedVoucher.voucherType === 'gift-card' ? 'GC' : 
                               selectedVoucher.voucherType === 'escrow' || selectedVoucher.voucherType === 'purchase_escrow' ? 'ESC' :
                               selectedVoucher.voucherType === 'prepaid' ? 'PP' : 'WO'}-{Date.now().toString().slice(-8)}
                  </p>
                  <p className="text-xs text-white/60">
                    Created: {formatDate(selectedVoucher.voucherData.created_at)}
                  </p>
                </div>
                </div>
              </div>

            {/* Voucher Type Specific Details */}
            {(() => {
              console.log('🔍 Checking voucher type for rendering:');
              console.log('🔍 selectedVoucher.voucherType:', selectedVoucher.voucherType);
              console.log('🔍 Should render work order:', selectedVoucher.voucherType === 'work-order' || selectedVoucher.voucherType === 'work_order');
              return selectedVoucher.voucherType === 'work-order' || selectedVoucher.voucherType === 'work_order';
            })() && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Work Order Details</h3>
              <div className="space-y-4">
                  {/* Project Details */}
                  <div className="bg-neutral-50 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">Project Details</h4>
                    <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.title || 'Project Title'}</p>
                    <p className="text-sm text-neutral-600 mt-1">{selectedVoucher.voucherData.description || 'Project description'}</p>
                  </div>

                  {/* Client and Amount */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Client</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.client_name || 'Client Name'}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Client Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.client_email || 'N/A'}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Available Amount</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedVoucher.voucherData.available_amount || selectedVoucher.voucherData.total_amount || 0)}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Total Amount</p>
                      <p className="text-lg font-semibold text-neutral-700">{formatCurrency(selectedVoucher.voucherData.total_amount || 0)}</p>
                  </div>
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Payment Type</p>
                      <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.voucherData.payment_type || 'Full Payment'}</p>
                  </div>
                  </div>

                  {/* Due Date */}
                  {selectedVoucher.voucherData.due_date && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Due Date</p>
                      <p className="font-medium text-neutral-900">{formatDate(selectedVoucher.voucherData.due_date)}</p>
                </div>
                  )}

                  {/* Terms */}
                  {selectedVoucher.voucherData.terms && (
                  <div className="bg-neutral-50 rounded-lg p-4">
                      <p className="text-neutral-600 mb-1">Terms & Conditions</p>
                      <p className="text-neutral-900">{selectedVoucher.voucherData.terms}</p>
                  </div>
                )}

                  {/* Milestones Section */}
                  {(() => {
                    console.log('🔍 Checking milestones for rendering:');
                    console.log('🔍 selectedVoucher.voucherData.milestones:', selectedVoucher.voucherData.milestones);
                    console.log('🔍 Is array:', Array.isArray(selectedVoucher.voucherData.milestones));
                    console.log('🔍 Length:', selectedVoucher.voucherData.milestones?.length);
                    console.log('🔍 Should render:', selectedVoucher.voucherData.milestones && Array.isArray(selectedVoucher.voucherData.milestones) && selectedVoucher.voucherData.milestones.length > 0);
                    
                    return selectedVoucher.voucherData.milestones && Array.isArray(selectedVoucher.voucherData.milestones) && selectedVoucher.voucherData.milestones.length > 0;
                  })() && (
                    <div className="bg-neutral-50 rounded-lg p-4">
                      <h4 className="font-semibold mb-3">Payment Milestones</h4>
                      <div className="space-y-2">
                        {selectedVoucher.voucherData.milestones.map((milestone, index) => {
                          console.log(`🔍 Rendering milestone ${index}:`, milestone);
                          return (
                            <div key={milestone.id || index} className="flex justify-between items-center">
                              <div>
                                <p className="font-medium text-neutral-900">{milestone.name || `Milestone ${index + 1}`}</p>
                                <p className="text-sm text-neutral-600">{parseFloat(milestone.percentage) || 0}%</p>
                              </div>
                              <div className="text-right">
                                <span className="font-bold text-blue-600">{formatCurrency(parseFloat(milestone.amount) || 0)}</span>
                                <div className="mt-1">
                                                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              milestone.status === 'completed' ? 'bg-green-100 text-green-600' : 
                              milestone.status === 'available' ? 'bg-blue-100 text-blue-600' :
                              milestone.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 
                              'bg-neutral-100 text-neutral-600'
                            }`}>
                              {milestone.status || 'pending'}
                            </span>
              </div>
            </div>
                            </div>
                          );
                        })}
          </div>

                      {/* Milestones Summary */}
                      <div className="mt-4 bg-blue-100 rounded-lg p-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium text-neutral-900">Total Milestones:</span>
                          <span className="font-bold text-blue-600">{selectedVoucher.voucherData.milestones.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-neutral-600">Total Percentage:</span>
                          <span className="font-medium text-neutral-900">
                            {selectedVoucher.voucherData.milestones.reduce((sum, m) => sum + (parseFloat(m.percentage) || 0), 0)}%
                          </span>
                        </div>
                  </div>
                  </div>
                  )}
                </div>
              </div>
            )}

            {(selectedVoucher.voucherType === 'escrow' || selectedVoucher.voucherType === 'purchase_escrow') && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Escrow Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Item Title</p>
                    <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.title || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Item Description</p>
                    <p className="text-neutral-900">{selectedVoucher.voucherData.description || 'No description provided'}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Seller Name</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.seller_name || 'N/A'}</p>
                </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Seller Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.seller_email || 'N/A'}</p>
            </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Buyer Name</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.buyer_name || 'N/A'}</p>
          </div>
              <div>
                      <p className="text-sm text-neutral-600 mb-1">Buyer Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.buyer_email || 'N/A'}</p>
              </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Item Value</p>
                      <p className="font-medium text-neutral-900">{formatCurrency(selectedVoucher.voucherData.item_value || 0)}</p>
            </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Shipping Method</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.shipping_method || 'N/A'}</p>
            </div>
                  </div>
                </div>
              </div>
            )}

            {selectedVoucher.voucherType === 'gift-card' && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Gift Card Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Recipient Name</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.recipient_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Recipient Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.recipient_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Sender Name</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.sender_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Sender Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.sender_email || 'N/A'}</p>
                    </div>
                  <div>
                      <p className="text-sm text-neutral-600 mb-1">Theme</p>
                      <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.voucherData.theme || 'N/A'}</p>
                  </div>
                  <div>
                      <p className="text-sm text-neutral-600 mb-1">Delivery Method</p>
                      <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.voucherData.delivery_method || 'N/A'}</p>
                    </div>
                  </div>
                  {selectedVoucher.voucherData.message && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Message</p>
                      <p className="text-neutral-900 italic">"{selectedVoucher.voucherData.message}"</p>
                    </div>
                  )}
                </div>
                    </div>
                  )}

            {selectedVoucher.voucherType === 'prepaid' && (
              <div className="bg-white border border-neutral-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Prepaid Voucher Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Recipient Name</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.recipient_name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Recipient Email</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.recipient_email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Recipient Phone</p>
                      <p className="font-medium text-neutral-900">{selectedVoucher.voucherData.recipient_phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Business Category</p>
                      <p className="font-medium text-neutral-900 capitalize">{selectedVoucher.voucherData.business_category || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Expiry Date</p>
                      <p className="font-medium text-neutral-900">
                        {selectedVoucher.voucherData.expiry_date ? formatDate(selectedVoucher.voucherData.expiry_date) : 'No expiry'}
                      </p>
                    </div>
                        <div>
                      <p className="text-sm text-neutral-600 mb-1">Auto Reload</p>
                      <p className="font-medium text-neutral-900">
                        {selectedVoucher.voucherData.auto_reload ? 'Enabled' : 'Disabled'}
                      </p>
                        </div>
                      </div>
                  {selectedVoucher.voucherData.message && (
                    <div>
                      <p className="text-sm text-neutral-600 mb-1">Message</p>
                      <p className="text-neutral-900 italic">"{selectedVoucher.voucherData.message}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {(() => {
              console.log('🔍 Action Buttons Debug:');
              console.log('🔍 Voucher Type:', selectedVoucher.voucherType);
              console.log('🔍 Voucher Status:', selectedVoucher.voucherData.status);
              console.log('🔍 Is Work Order:', selectedVoucher.voucherType === 'work_order');
              console.log('🔍 Is Active:', selectedVoucher.voucherData.status === 'active');
              console.log('🔍 Is Purchase Escrow:', selectedVoucher.voucherType === 'purchase_escrow' || selectedVoucher.voucherType === 'purchase-escrow');
              console.log('🔍 Is Active (for purchase):', selectedVoucher.voucherData.status === 'active');
              return true;
            })()}
            
            {/* Work Order Actions */}
            {selectedVoucher.voucherType === 'work_order' && (selectedVoucher.voucherData.status === 'active' || selectedVoucher.voucherData.status === 'pending' || selectedVoucher.voucherData.status === 'available') && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-3">
                  {selectedVoucher.voucherData.status === 'pending' ? 'Dispute Resolution' : 
                   selectedVoucher.voucherData.status === 'available' ? 'Voucher Actions' : 'Work Order Actions'}
                </h3>
                
                {selectedVoucher.voucherData.status === 'active' ? (
                  <>
                    <button
                      onClick={handleReleaseMilestone}
                      disabled={isReleasingMilestone}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
                    >
                      {isReleasingMilestone ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Releasing...</span>
                        </>
                      ) : (
                        <>
                          <span>🎯</span>
                          <span>Release Milestone Funds</span>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-blue-700 mb-3">
                      Release the next pending milestone to make funds available for withdrawal
                    </p>
                  </>
                ) : selectedVoucher.voucherData.status === 'pending' ? (
                  <>
                    <button
                      onClick={handleResolveDispute}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center space-x-2 mb-3"
                    >
                      <span>🎯</span>
                      <span>Release Milestone & Resolve Dispute</span>
                    </button>
                    <p className="text-sm text-blue-700 mb-3">
                      Release milestone funds and resolve the dispute. Voucher will be available for redemption.
                    </p>
                  </>
                ) : (
                  // Available status - only show cancel button
                  <p className="text-sm text-blue-700 mb-3">
                    This voucher has available milestones for redemption. You can cancel it if needed.
                  </p>
                )}
                
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span>❌</span>
                  <span>Cancel Voucher</span>
                </button>
                <p className="text-sm text-red-700 mt-2">
                  Initiate cancellation process. Recipient will be notified.
                </p>
              </div>
            )}

            {/* Purchase Escrow Actions */}
            {(selectedVoucher.voucherType === 'purchase_escrow' || selectedVoucher.voucherType === 'purchase-escrow' || selectedVoucher.voucherType === 'escrow') && (selectedVoucher.voucherData.status === 'active' || selectedVoucher.voucherData.status === 'pending' || selectedVoucher.voucherData.status === 'available') && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-3">
                  {selectedVoucher.voucherData.status === 'pending' ? 'Dispute Resolution' : 
                   selectedVoucher.voucherData.status === 'available' ? 'Voucher Actions' : 'Purchase Actions'}
                </h3>
                
                {selectedVoucher.voucherData.status === 'active' ? (
                  <>
                    <button
                      onClick={handleActivateVoucher}
                      disabled={isActivatingVoucher}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
                    >
                      {isActivatingVoucher ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Making Available...</span>
                        </>
                      ) : (
                        <>
                          <span>✅</span>
                          <span>Make Available for Redemption</span>
                        </>
                      )}
                    </button>
                    <p className="text-sm text-green-700 mb-3">
                      Change voucher status to 'available' so it can be redeemed for withdrawal
                    </p>
                  </>
                ) : selectedVoucher.voucherData.status === 'pending' ? (
                  <>
                    <button
                      onClick={handleResolveDispute}
                      className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center space-x-2 mb-3"
                    >
                      <span>✅</span>
                      <span>Activate & Resolve Dispute</span>
                    </button>
                    <p className="text-sm text-green-700 mb-3">
                      Activate voucher and resolve the dispute. Voucher will be available for redemption.
                    </p>
                  </>
                ) : (
                  // Available status - only show cancel button
                  <p className="text-sm text-green-700 mb-3">
                    This voucher is available for redemption. You can cancel it if needed.
                  </p>
                )}
                
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  <span>❌</span>
                  <span>Cancel Voucher</span>
                </button>
                <p className="text-sm text-red-700 mt-2">
                  Initiate cancellation process. Recipient will be notified.
                </p>
              </div>
            )}

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
        </div>
      </div>
      
      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-large max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Cancel Voucher</h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter reason for cancellation..."
                  rows="3"
                />
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Important Notice</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Cancelling this voucher will notify the recipient. The voucher will be put on hold until the recipient confirms the cancellation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 px-4 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCancelVoucher}
                  disabled={isCancellingVoucher}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isCancellingVoucher ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Cancelling...</span>
                    </div>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default VoucherPreview; 