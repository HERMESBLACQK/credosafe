import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Settings as SettingsIcon, 
  ArrowLeft,
  User,
  Bell,
  Lock,
  Globe,
  Palette,
  Shield as SecurityIcon
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const Settings = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const settingsSections = [
    {
      title: 'Account',
      icon: <User className="w-5 h-5" />,
      items: [
        { label: 'Profile Information', description: 'Update your personal details' },
        { label: 'Email Preferences', description: 'Manage email notifications' },
        { label: 'Password & Security', description: 'Change password and security settings' }
      ]
    },
    {
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      items: [
        { label: 'Push Notifications', description: 'Configure push notification settings' },
        { label: 'Email Alerts', description: 'Manage email alert preferences' },
        { label: 'Transaction Notifications', description: 'Set up transaction alerts' }
      ]
    },
    {
      title: 'Security',
      icon: <SecurityIcon className="w-5 h-5" />,
      items: [
        { label: 'Two-Factor Authentication', description: 'Enable 2FA for extra security' },
        { label: 'Login History', description: 'View recent login activity' },
        { label: 'Device Management', description: 'Manage connected devices' }
      ]
    },
    {
      title: 'Preferences',
      icon: <Palette className="w-5 h-5" />,
      items: [
        { label: 'Theme Settings', description: 'Choose light or dark theme' },
        { label: 'Language', description: 'Select your preferred language' },
        { label: 'Currency', description: 'Set your default currency' }
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
            <motion.button 
              onClick={() => navigate('/dashboard')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
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
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.label}
                      className="p-6 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-neutral-900">{item.label}</h3>
                          <p className="text-sm text-neutral-600">{item.description}</p>
                        </div>
                        <div className="text-neutral-400">
                          <ArrowLeft className="w-5 h-5 transform rotate-180" />
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
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Settings Coming Soon</h3>
            <p className="text-blue-700">
              More customization options and advanced features will be available in future updates.
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