import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../contexts/ErrorContext';
import { 
  Shield, 
  ArrowLeft,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Clock,
  Wifi,
  WifiOff,
  Trash2
} from 'lucide-react';

import apiService from '../api/index';
import FloatingFooter from '../components/FloatingFooter';

const DeviceManagement = () => {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);



  // Fetch user devices
  const fetchDevices = async () => {
    try {
      setLoading(true);
      const response = await apiService.auth.getDevices();
      console.log('📱 Devices response:', response);
      
      if (response.success) {
        // Handle both possible response structures
        const devices = response.data?.data?.devices || response.data?.devices || [];
        setDevices(devices);
        console.log('📱 Devices set:', devices);
      } else {
        console.log('❌ Failed to fetch devices:', response.error);
        setDevices([]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (isActive) => {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isActive 
          ? 'bg-green-100 text-green-800' 
          : 'bg-gray-100 text-gray-800'
      }`}>
        {isActive ? (
          <>
            <Wifi className="w-3 h-3 mr-1" />
            Active
          </>
        ) : (
          <>
            <WifiOff className="w-3 h-3 mr-1" />
            Inactive
          </>
        )}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
                         <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900">CredoSafe</span>
                             </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Device Management</h1>
            <p className="text-neutral-600">Manage your connected devices and sessions</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {(!devices || devices.length === 0) ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-neutral-400" />
                </div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">No Devices Found</h3>
                  <p className="text-neutral-600">Your connected devices will appear here when you log in.</p>
                </div>
              ) : (
                devices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-white rounded-2xl shadow-soft p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                          {getDeviceIcon(device.deviceType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-neutral-900">{device.deviceName}</h3>
                            {getStatusBadge(device.isActive)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-600">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Monitor className="w-4 h-4" />
                                <span>{device.browser} on {device.os}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                                <Globe className="w-4 h-4" />
                                <span>{device.location}</span>
                      </div>
                    </div>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Last activity: {formatDate(device.lastActivity)}</span>
                </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-neutral-500">
                                  IP: {device.ipAddress}
                                </span>
            </div>
          </div>
                          </div>
                        </div>
                      </div>
                      {!device.isActive && (
                        <button
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove device"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Device Security</h3>
            <ul className="text-blue-700 space-y-1 text-sm">
              <li>• Active devices show your current sessions</li>
              <li>• Inactive devices are previous login sessions</li>
              <li>• You can remove inactive devices for security</li>
              <li>• New logins will create new device entries</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default DeviceManagement; 