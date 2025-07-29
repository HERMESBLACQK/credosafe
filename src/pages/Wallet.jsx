import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Wallet as WalletIcon, 
  ArrowLeft,
  Plus,
  Minus,
  DollarSign,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const Wallet = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
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
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Wallet</h1>
            <p className="text-neutral-600">Manage your funds and transactions</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-soft text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <WalletIcon className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Wallet Features Coming Soon</h2>
            <p className="text-neutral-600 mb-6">
              Advanced wallet features including detailed transaction history, 
              fund transfers, and payment methods will be available soon.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4">
                <Plus className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-neutral-900 mb-1">Add Funds</h3>
                <p className="text-sm text-neutral-600">Deposit money to your wallet</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4">
                <Minus className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <h3 className="font-semibold text-neutral-900 mb-1">Withdraw</h3>
                <p className="text-sm text-neutral-600">Withdraw funds to your bank</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Floating Footer Navigation */}
      <FloatingFooter />
    </div>
  );
};

export default Wallet; 