import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Copy, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Gift,
  UserPlus,
  DollarSign,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useError } from '../contexts/ErrorContext';
import { referralAPI } from '../api';

const Referral = () => {
  const { user } = useUser();
  const [referralStats, setReferralStats] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [referredUsers, setReferredUsers] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);
  const [showReferralCode, setShowReferralCode] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      // Fetch referral stats
      const statsResponse = await referralAPI.getStats();
      if (statsResponse.data.success) {
        setReferralStats(statsResponse.data.data);
        setReferralCode(statsResponse.data.data.referralCode);
      }

      // Fetch referral settings
      const settingsResponse = await referralAPI.getSettings();
      if (settingsResponse.data.success) {
        setSettings(settingsResponse.data.data);
      }

      // Fetch referred users
      const usersResponse = await referralAPI.getReferredUsers();
      if (usersResponse.data.success) {
        setReferredUsers(usersResponse.data.data.referredUsers);
      }

      // Fetch earnings
      const earningsResponse = await referralAPI.getEarnings();
      if (earningsResponse.data.success) {
        setEarnings(earningsResponse.data.data.earnings);
      }

    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getEarningTypeIcon = (type) => {
    switch (type) {
      case 'signup_bonus':
        return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'transaction_bonus':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      default:
        return <Gift className="w-4 h-4 text-purple-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Referral Program</h1>
          <p className="text-gray-600">Earn rewards by inviting friends to CredoSafe</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">
                  {referralStats?.referralCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(referralStats?.totalEarnings || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(referralStats?.pendingEarnings || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Gift className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Signup Bonus</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₦{(settings?.signup_bonus || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Referral Code Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow mb-8"
        >
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Referral Code</h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type={showReferralCode ? "text" : "password"}
                    value={referralCode}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-lg"
                  />
                  <button
                    onClick={() => setShowReferralCode(!showReferralCode)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showReferralCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button
                onClick={copyReferralCode}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Share this code with friends to earn rewards when they sign up and make transactions
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: TrendingUp },
                { id: 'referred', label: 'Referred Users', icon: Users },
                { id: 'earnings', label: 'Earnings', icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          1
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Share Your Code</p>
                          <p className="text-sm text-gray-600">Share your unique referral code with friends</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          2
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">They Sign Up</p>
                          <p className="text-sm text-gray-600">Friends use your code when creating an account</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          3
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Earn Rewards</p>
                          <p className="text-sm text-gray-600">Get ₦{settings?.signup_bonus?.toLocaleString()} bonus per signup</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rewards</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Signup Bonus</span>
                        <span className="font-semibold text-green-600">₦{settings?.signup_bonus?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Transaction Bonus</span>
                        <span className="font-semibold text-green-600">{settings?.transaction_percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Min Transaction</span>
                        <span className="font-semibold text-gray-900">₦{settings?.min_transaction_amount?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Max Earnings</span>
                        <span className="font-semibold text-gray-900">₦{settings?.max_referral_earnings?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Referred Users Tab */}
            {activeTab === 'referred' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Referred Users</h3>
                {referredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No referred users yet</p>
                    <p className="text-sm text-gray-400">Share your referral code to start earning</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Earnings
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {referredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.first_name} {user.last_name}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.is_verified 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {user.is_verified ? 'Verified' : 'Pending'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.amount ? `₦${parseFloat(user.amount).toLocaleString()}` : '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings History</h3>
                {earnings.length === 0 ? (
                  <div className="text-center py-8">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No earnings yet</p>
                    <p className="text-sm text-gray-400">Start referring friends to earn rewards</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {earnings.map((earning) => (
                      <div key={earning.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getEarningTypeIcon(earning.type)}
                            <div>
                              <p className="font-medium text-gray-900">
                                {earning.type === 'signup_bonus' ? 'Signup Bonus' : 'Transaction Bonus'}
                              </p>
                              <p className="text-sm text-gray-500">
                                {earning.referred_user_first_name} {earning.referred_user_last_name}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₦{parseFloat(earning.amount).toLocaleString()}
                            </p>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(earning.status)}`}>
                              {earning.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          {new Date(earning.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Referral; 