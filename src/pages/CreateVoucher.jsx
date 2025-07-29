import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  Handshake,
  CreditCard,
  Gift,
  Plus
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const CreateVoucher = () => {
  const navigate = useNavigate();

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
      route: "/work-order-vouchers"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Purchase Escrow Vouchers",
      description: "Secure transactions with escrow protection. Both parties must agree before release.",
      features: ["Escrow protection", "Dual approval", "Secure transactions", "Dispute resolution"],
      color: "from-green-500 to-green-600",
      route: "/purchase-escrow-vouchers"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Prepaid Vouchers",
      description: "Load funds and use at participating businesses. Instant redemption available.",
      features: ["Prepaid balance", "Business network", "Instant redemption", "Balance tracking"],
      color: "from-purple-500 to-purple-600",
      route: "/prepaid-vouchers"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Gift Card Vouchers",
      description: "Send anonymous or personalized gift cards. Flexible redemption options.",
      features: ["Anonymous sending", "Personalized messages", "Flexible amounts", "Digital delivery"],
      color: "from-pink-500 to-pink-600",
      route: "/gift-card-vouchers"
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