import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Shield, 
  User, 
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Camera
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // Mock user profile data
  const profileData = {
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, NY',
    joinDate: 'January 2024',
    avatar: null
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Profile</h1>
            <p className="text-neutral-600">Manage your account information</p>
          </div>

          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-soft p-8 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-neutral-600 mb-4">CredoSafe Member</p>
              <button className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium">
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Personal Information</h3>
            </div>
            <div className="divide-y divide-neutral-200">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Full Name</p>
                    <p className="font-medium text-neutral-900">{profileData.firstName} {profileData.lastName}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Email Address</p>
                    <p className="font-medium text-neutral-900">{profileData.email}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Phone Number</p>
                    <p className="font-medium text-neutral-900">{profileData.phone}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Location</p>
                    <p className="font-medium text-neutral-900">{profileData.location}</p>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Member Since</p>
                    <p className="font-medium text-neutral-900">{profileData.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-6 bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-xl font-bold text-neutral-900">Account Actions</h3>
            </div>
            <div className="divide-y divide-neutral-200">
              <button className="w-full p-6 text-left hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Change Password</p>
                    <p className="text-sm text-neutral-600">Update your account password</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-neutral-400 transform rotate-180" />
                </div>
              </button>
              <button className="w-full p-6 text-left hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Privacy Settings</p>
                    <p className="text-sm text-neutral-600">Manage your privacy preferences</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-neutral-400 transform rotate-180" />
                </div>
              </button>
              <button className="w-full p-6 text-left hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900">Account Security</p>
                    <p className="text-sm text-neutral-600">Two-factor authentication and security</p>
                  </div>
                  <ArrowLeft className="w-5 h-5 text-neutral-400 transform rotate-180" />
                </div>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Profile; 