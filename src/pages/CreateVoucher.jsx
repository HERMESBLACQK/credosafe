import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Handshake,
  CreditCard,
  Gift,
  Plus,
  AlertTriangle
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';
import apiService from '../api/index';
import { useDispatch } from 'react-redux';
import { showToast } from '../store/slices/uiSlice';

const CreateVoucher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRequiredData, setHasRequiredData] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await apiService.getUser();
        setUserData(user);
        setHasRequiredData(user.phone && user.location);
      } catch {
        dispatch(showToast({ message: "Failed to fetch user data.", type: "error" }));
        navigate("/"); // Redirect to home if user data cannot be fetched
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [dispatch, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">User data not found. Please ensure you are logged in.</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-primary-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!hasRequiredData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 pb-24 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Incomplete Profile</h2>
          <p className="text-neutral-600 mb-6">
            To create vouchers, you need to complete your profile. Please add your phone number and location.
          </p>
          <button
            onClick={() => navigate("/profile")}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const voucherTypes = [
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Work Order Vouchers",
      description: "Create milestone-based or full payment vouchers for work orders. Redeem upon completion.",
      features: ["Milestone payments", "Full payment options", "Escrow protection", "Completion verification"],
      color: "from-blue-500 to-blue-600",
      route: "/work-order"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Purchase Escrow Vouchers",
      description: "Secure transactions with escrow protection. Both parties must agree before release.",
      features: ["Escrow protection", "Dual approval", "Secure transactions", "Dispute resolution"],
      color: "from-green-500 to-green-600",
      route: "/purchase-escrow"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Prepaid Vouchers",
      description: "Load funds and use at participating businesses. Instant redemption available.",
      features: ["Prepaid balance", "Business network", "Instant redemption", "Balance tracking"],
      color: "from-purple-500 to-purple-600",
      route: "/prepaid"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Gift Card Vouchers",
      description: "Send anonymous or personalized gift cards. Flexible redemption options.",
      features: ["Anonymous sending", "Personalized messages", "Flexible amounts", "Digital delivery"],
      color: "from-pink-500 to-pink-600",
      route: "/gift-card"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create Voucher</h1>
            <p className="text-neutral-600">Choose the type of voucher you want to create</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {voucherTypes.map((voucher, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                onClick={() => navigate(voucher.route)}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all transform hover:-translate-y-2 cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${voucher.color} rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {voucher.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 mb-4">{voucher.title}</h3>
                <p className="text-neutral-600 mb-6">{voucher.description}</p>
                <ul className="space-y-2 mb-6">
                  {voucher.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                      <span className="text-neutral-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full bg-gradient-to-r ${voucher.color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2`}>
                  <span>Create {voucher.title}</span>
                  <ArrowLeft className="w-4 h-4 transform rotate-180" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default CreateVoucher; 