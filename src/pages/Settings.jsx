import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Shield, 
  Settings as SettingsIcon, 
  ArrowLeft,
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Shield as SecurityIcon,
  ArrowRight,
  LogOut,
  Smartphone,
  Monitor
} from 'lucide-react';
import { logoutUser, updateUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import apiService from '../api/index';
import FloatingFooter from '../components/FloatingFooter';
import ErrorMessage from '../components/ErrorMessage';
import { useUser } from '../hooks/useUser';

const Settings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userProfile, isUserLoaded, isLoading } = useUser();
  
  const [notifications, setNotifications] = useState({
    pushNotifications: userProfile.settings.pushNotifications,
    emailAlerts: userProfile.settings.emailAlerts,
    transactionNotifications: userProfile.settings.transactionNotifications,
    emailPreferences: userProfile.settings.emailPreferences
  });
  const [security, setSecurity] = useState({
    twoFactorAuth: userProfile.settings.twoFactorAuth
  });
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const handleNotificationToggle = async (key) => {
    try {
      const newValue = !notifications[key];
      setNotifications(prev => ({
        ...prev,
        [key]: newValue
      }));

      // Update on server
      const response = await apiService.auth.updateSettings({
        [key]: newValue
      });

      if (response.success) {
        // Update user in Redux store with the returned user data
        dispatch(updateUser(response.data.user));
        
        // Update local settings with the new user data
        setNotifications({
          pushNotifications: response.data.user.pushNotifications ?? true,
          emailAlerts: response.data.user.emailAlerts ?? true,
          transactionNotifications: response.data.user.transactionNotifications ?? true,
          emailPreferences: response.data.user.emailPreferences ?? true
        });
        
        dispatch(showToast({
          message: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newValue ? 'enabled' : 'disabled'}`,
          type: 'success'
        }));
      } else {
        // Revert on failure
        setNotifications(prev => ({
          ...prev,
          [key]: !newValue
        }));
        dispatch(showToast({
          message: response.error || 'Failed to update setting',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('Settings update error:', error);
      // Revert on error
      setNotifications(prev => ({
        ...prev,
        [key]: !notifications[key]
      }));
      dispatch(showToast({
        message: 'Failed to update setting',
        type: 'error'
      }));
    }
  };

  const handleSecurityToggle = async (key) => {
    try {
      const newValue = !security[key];
      setSecurity(prev => ({
        ...prev,
        [key]: newValue
      }));

      // Update on server
      const response = await apiService.auth.updateSettings({
        [key]: newValue
      });

      if (response.success) {
        // Update user in Redux store with the returned user data
        dispatch(updateUser(response.data.user));
        
        // Update local settings with the new user data
        setSecurity({
          twoFactorAuth: response.data.user.twoFactorAuth ?? true
        });
        
        dispatch(showToast({
          message: `${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} ${newValue ? 'enabled' : 'disabled'}`,
          type: 'success'
        }));
      } else {
        // Revert on failure
        setSecurity(prev => ({
          ...prev,
          [key]: !newValue
        }));
        dispatch(showToast({
          message: response.error || 'Failed to update setting',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('Settings update error:', error);
      // Revert on error
      setSecurity(prev => ({
        ...prev,
        [key]: !security[key]
      }));
      dispatch(showToast({
        message: 'Failed to update setting',
        type: 'error'
      }));
    }
  };

  // Fetch user devices
  const fetchDevices = async () => {
    try {
      setError(null);
      console.log('🔍 Fetching devices...');
      
      const response = await apiService.auth.getDevices();
      console.log('📱 Devices response:', response);
      
      if (response.success) {
        // Handle both possible response structures
        const devices = response.data?.data?.devices || response.data?.devices || [];
        setDevices(devices);
        console.log('📱 Devices set:', devices);
      } else {
        console.log('❌ Failed to fetch devices:', response.error);
        setError(response.message || 'Failed to fetch devices');
        setDevices([]);
      }
    } catch (error) {
      console.error('Error fetching devices:', error);
      setError('Failed to fetch devices. Please try again.');
      setDevices([]);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    setLoading(true);
    try {
      // Dispatch logout action (this will call the API and handle token removal)
      await dispatch(logoutUser()).unwrap();
      
      dispatch(showToast({ 
        message: 'Logged out successfully', 
        type: 'success' 
      }));
      
      navigate('/signin');
    } catch (error) {
      console.error('Logout error:', error);
      dispatch(showToast({ 
        message: 'Logout failed. Please try again.', 
        type: 'error' 
      }));
    } finally {
      setLoading(false);
    }
  };

  // Update settings when user data changes
  useEffect(() => {
    if (isUserLoaded && userProfile) {
      console.log('⚙️ Settings: Updating settings from user data');
      setNotifications({
        pushNotifications: userProfile.settings.pushNotifications,
        emailAlerts: userProfile.settings.emailAlerts,
        transactionNotifications: userProfile.settings.transactionNotifications,
        emailPreferences: userProfile.settings.emailPreferences
      });
      setSecurity({
        twoFactorAuth: userProfile.settings.twoFactorAuth
      });
    }
  }, [userProfile, isUserLoaded]);

  // Fetch devices on component mount
  useEffect(() => {
    fetchDevices();
  }, []);

  const settingsSections = [
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        { 
          label: 'Profile Information', 
          description: 'Update your personal details',
          type: 'navigation',
          action: () => navigate('/profile')
        },
        { 
          label: 'Password & Security', 
          description: 'Change password and security settings',
          type: 'navigation',
          action: () => navigate('/change-password')
        },
        { 
          label: 'Upgrade Tier', 
          description: 'Upgrade your account for higher limits',
          type: 'navigation',
          action: () => navigate('/tier')
        },
        { 
          label: 'FAQ & Support', 
          description: 'Frequently asked questions and contact information',
          type: 'navigation',
          action: () => navigate('/faq')
        }
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        { 
          label: 'Push Notifications', 
          description: 'Configure push notification settings',
          type: 'toggle',
          key: 'pushNotifications',
          value: notifications.pushNotifications,
          action: () => handleNotificationToggle('pushNotifications')
        },
        { 
          label: 'Email Alerts', 
          description: 'Manage email alert preferences',
          type: 'toggle',
          key: 'emailAlerts',
          value: notifications.emailAlerts,
          action: () => handleNotificationToggle('emailAlerts')
        },
        { 
          label: 'Transaction Notifications', 
          description: 'Set up transaction alerts',
          type: 'toggle',
          key: 'transactionNotifications',
          value: notifications.transactionNotifications,
          action: () => handleNotificationToggle('transactionNotifications')
        },
        { 
          label: 'Email Preferences', 
          description: 'Manage email notification settings',
          type: 'toggle',
          key: 'emailPreferences',
          value: notifications.emailPreferences,
          action: () => handleNotificationToggle('emailPreferences')
        }
      ]
    },
    {
      title: 'Security',
      icon: <SecurityIcon className="w-5 h-5" />,
      items: [
        { 
          label: 'Two-Factor Authentication', 
          description: 'Enable 2FA for extra security',
          type: 'toggle',
          key: 'twoFactorAuth',
          value: security.twoFactorAuth,
          action: () => handleSecurityToggle('twoFactorAuth')
        },
        { 
          label: 'Device Management', 
          description: `Manage ${devices?.length || 0} connected devices`,
          type: 'navigation',
          action: () => navigate('/device-management')
        }
      ]
    },
    {
      title: 'Session',
      icon: <LogOut className="w-5 h-5" />,
      items: [
        { 
          label: 'Logout', 
          description: 'Sign out of your account',
          type: 'logout',
          action: handleLogout,
          loading: loading
        }
      ]
    }
  ];

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Settings</h1>
            <p className="text-neutral-600">Manage your account preferences and security</p>
          </div>

          <div className="space-y-6">
            {settingsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <div className="p-6 border-b border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      {section.icon}
                    </div>
                    <h2 className="text-xl font-bold text-neutral-900">{section.title}</h2>
                  </div>
                </div>
                <div className="divide-y divide-neutral-200">
                  {section.items.map((item) => (
                    <div
                      key={item.label}
                      className={`p-6 transition-colors ${
                        item.type === 'navigation' ? 'hover:bg-neutral-50 cursor-pointer' : ''
                      }`}
                      onClick={item.type === 'navigation' ? item.action : undefined}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-neutral-900">{item.label}</h3>
                          <p className="text-sm text-neutral-600">{item.description}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          {item.type === 'toggle' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                                item.value ? 'bg-primary-600' : 'bg-neutral-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.value ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          )}
                          {item.type === 'navigation' && (
                            <ArrowRight className="w-5 h-5 text-neutral-400" />
                          )}
                          {item.type === 'logout' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                item.action();
                              }}
                              disabled={item.loading}
                              className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                              {item.loading ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <LogOut className="w-4 h-4" />
                              )}
                              <span className="text-sm font-medium">Logout</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming Soon Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">More Settings Coming Soon</h3>
            <p className="text-blue-700">
              Theme settings, language preferences, and currency options will be available in future updates.
            </p>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Settings; 