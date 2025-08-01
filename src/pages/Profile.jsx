import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  Shield, 
  User, 
  ArrowLeft,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Edit,
  Camera,
  Save,
  X
} from 'lucide-react';
import apiService from '../api/index';
import { updateUser } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';
import FloatingFooter from '../components/FloatingFooter';
import { useUser } from '../hooks/useUser';

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, userProfile, isUserLoaded, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  // User profile data from Redux store
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    joinDate: '',
    avatarUrl: ''
  });

  // File input ref for image upload
  const fileInputRef = React.useRef(null);

  // Update profile data when user changes
  useEffect(() => {
    console.log('👤 Profile component - user data:', user);
    console.log('👤 Profile component - userProfile:', userProfile);
    console.log('👤 Profile component - isUserLoaded:', isUserLoaded);
    
    if (isUserLoaded && userProfile) {
      const newProfileData = {
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phone: userProfile.phone,
        location: userProfile.location,
        joinDate: userProfile.joinDate,
        avatarUrl: userProfile.avatarUrl
      };
      console.log('📝 Setting profile data:', newProfileData);
      setProfileData(newProfileData);
    } else {
      console.log('⚠️ No user data available');
    }
  }, [userProfile, isUserLoaded]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

    const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        dispatch(showToast({
          message: 'Please select an image file',
          type: 'error'
        }));
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        dispatch(showToast({
          message: 'Image size should be less than 5MB',
          type: 'error'
        }));
        return;
      }

      // Convert to base64 for demo (in production, upload to cloud storage)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target.result;
        setProfileData(prev => ({
          ...prev,
          avatarUrl: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      
      // Only send updatable fields
      const updateData = {
        phone: profileData.phone,
        location: profileData.location,
        avatarUrl: profileData.avatarUrl
      };

      console.log('📤 Sending profile update:', updateData);
      
      const response = await apiService.auth.updateProfile(updateData);
      console.log('📥 Profile update response:', response);
      
      if (response.success) {
        // Update user in Redux store with the returned user data
        dispatch(updateUser(response.data.user));
        
        // Update local profile data with the new user data
        setProfileData({
          firstName: response.data.user.firstName || '',
          lastName: response.data.user.lastName || '',
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          location: response.data.user.location || '',
          joinDate: response.data.user.createdAt ? new Date(response.data.user.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long'
          }) : '',
          avatarUrl: response.data.user.avatarUrl || ''
        });
        
        dispatch(showToast({
          message: 'Profile updated successfully',
          type: 'success'
        }));
        
    setIsEditing(false);
      } else {
        dispatch(showToast({
          message: response.error || 'Failed to update profile',
          type: 'error'
        }));
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      dispatch(showToast({
        message: 'Failed to update profile',
        type: 'error'
      }));
    } finally {
      setLoading(false);
    }
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
      
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading || !isUserLoaded ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-600 font-medium">Loading your profile...</p>
          </div>
        ) : (
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
                 {profileData.avatarUrl ? (
                   <img 
                     src={profileData.avatarUrl} 
                     alt="Profile" 
                     className="w-24 h-24 rounded-full object-cover"
                   />
                 ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-white" />
                </div>
                 )}
                 {isEditing && (
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="absolute bottom-0 right-0 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors"
                   >
                  <Camera className="w-4 h-4 text-white" />
                </button>
                 )}
                 <input
                   ref={fileInputRef}
                   type="file"
                   accept="image/*"
                   onChange={handleImageUpload}
                   className="hidden"
                 />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-neutral-600 mb-4">CredoSafe Member</p>
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="flex items-center space-x-2 text-white bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                    <button 
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                      className="flex items-center space-x-2 text-neutral-600 hover:text-neutral-800 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
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
                    <p className="text-xs text-neutral-500 mt-1">Name cannot be changed</p>
                  </div>
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
                    <p className="text-xs text-neutral-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Phone Number</p>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => handleProfileChange('phone', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Phone Number (e.g., +1 555 123 4567)"
                      />
                    ) : (
                      <p className="font-medium text-neutral-900">{profileData.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600">Location</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => handleProfileChange('location', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Location"
                      />
                    ) : (
                      <p className="font-medium text-neutral-900">{profileData.location || 'Not set'}</p>
                    )}
                  </div>
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
        </motion.div>
        )}
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Profile; 