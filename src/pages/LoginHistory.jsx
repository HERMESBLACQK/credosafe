import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Monitor,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle,
  Smartphone,
  Monitor as DesktopIcon
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const LoginHistory = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Mock login history data
  const loginHistory = [
    {
      id: '1',
      date: '2024-01-15T10:30:00Z',
      device: 'Desktop',
      location: 'New York, NY',
      ipAddress: '192.168.1.100',
      status: 'success',
      browser: 'Chrome 120.0.0.0',
      os: 'Windows 11'
    },
    {
      id: '2',
      date: '2024-01-14T14:20:00Z',
      device: 'Mobile',
      location: 'Los Angeles, CA',
      ipAddress: '203.0.113.45',
      status: 'success',
      browser: 'Safari Mobile',
      os: 'iOS 17.2'
    },
    {
      id: '3',
      date: '2024-01-13T09:15:00Z',
      device: 'Desktop',
      location: 'Chicago, IL',
      ipAddress: '198.51.100.23',
      status: 'failed',
      browser: 'Firefox 121.0',
      os: 'macOS 14.1'
    },
    {
      id: '4',
      date: '2024-01-12T16:45:00Z',
      device: 'Mobile',
      location: 'Miami, FL',
      ipAddress: '203.0.113.67',
      status: 'success',
      browser: 'Chrome Mobile',
      os: 'Android 14'
    },
    {
      id: '5',
      date: '2024-01-11T11:30:00Z',
      device: 'Desktop',
      location: 'Seattle, WA',
      ipAddress: '192.168.1.100',
      status: 'success',
      browser: 'Edge 120.0.0.0',
      os: 'Windows 11'
    },
    {
      id: '6',
      date: '2024-01-10T13:20:00Z',
      device: 'Mobile',
      location: 'Unknown',
      ipAddress: '203.0.113.89',
      status: 'failed',
      browser: 'Unknown',
      os: 'Unknown'
    }
  ];

  const filteredHistory = selectedFilter === 'all' 
    ? loginHistory 
    : loginHistory.filter(login => login.status === selectedFilter);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (device) => {
    return device === 'Mobile' ? <Smartphone className="w-5 h-5" /> : <DesktopIcon className="w-5 h-5" />;
  };

  const getStatusIcon = (status) => {
    return status === 'success' 
      ? <CheckCircle className="w-5 h-5 text-green-500" />
      : <AlertTriangle className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    return status === 'success' 
      ? 'text-green-600 bg-green-100' 
      : 'text-red-600 bg-red-100';
  };

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
              onClick={() => navigate('/settings')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Settings</span>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Login History</h1>
            <p className="text-neutral-600">Monitor your account login activity and security</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Successful Logins</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {loginHistory.filter(login => login.status === 'success').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Failed Attempts</p>
                  <p className="text-2xl font-bold text-neutral-900">
                    {loginHistory.filter(login => login.status === 'failed').length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-soft p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Total Sessions</p>
                  <p className="text-2xl font-bold text-neutral-900">{loginHistory.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-soft p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All ({loginHistory.length})
              </button>
              <button
                onClick={() => setSelectedFilter('success')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'success'
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Successful ({loginHistory.filter(login => login.status === 'success').length})
              </button>
              <button
                onClick={() => setSelectedFilter('failed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === 'failed'
                    ? 'bg-red-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Failed ({loginHistory.filter(login => login.status === 'failed').length})
              </button>
            </div>
          </div>

          {/* Login History List */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-neutral-900">Recent Login Activity</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((login, index) => (
                  <motion.div
                    key={login.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          {getDeviceIcon(login.device)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-neutral-900">
                              {login.device} - {login.browser}
                            </h3>
                            {getStatusIcon(login.status)}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-neutral-500">
                            <span className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{login.location}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatDate(login.date)}</span>
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">
                            IP: {login.ipAddress} • OS: {login.os}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(login.status)}`}>
                          {login.status}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <Monitor className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No login activity found</h3>
                  <p className="text-neutral-600">
                    {selectedFilter === 'all' 
                      ? 'No login history available yet.' 
                      : `No ${selectedFilter} login attempts found.`}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Security Tips */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Security Tips</h3>
            <ul className="text-blue-700 space-y-2 text-sm">
              <li>• Review your login history regularly for suspicious activity</li>
              <li>• If you notice unfamiliar logins, change your password immediately</li>
              <li>• Enable two-factor authentication for enhanced security</li>
              <li>• Log out from shared devices and public computers</li>
            </ul>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default LoginHistory; 