// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  CreditCard, 
  Gift, 
  Handshake, 
  ArrowRight, 
  CheckCircle,
  Users,
  Lock,
  Zap,
  Globe,
  LogIn,
  UserPlus,
  LogOut
} from 'lucide-react';
import { logoutUser } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';

const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
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
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Purchase Escrow Vouchers",
      description: "Secure transactions with escrow protection. Both parties must agree before release.",
      features: ["Escrow protection", "Dual approval", "Secure transactions", "Dispute resolution"],
      color: "from-green-500 to-green-600"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Prepaid Vouchers",
      description: "Load funds and use at participating businesses. Instant redemption available.",
      features: ["Prepaid balance", "Business network", "Instant redemption", "Balance tracking"],
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Gift Card Vouchers",
      description: "Send anonymous or personalized gift cards. Flexible redemption options.",
      features: ["Anonymous sending", "Personalized messages", "Flexible amounts", "Digital delivery"],
      color: "from-pink-500 to-pink-600"
    }
  ];

  const features = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure & Protected",
      description: "Bank-level security with encryption and fraud protection"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Processing",
      description: "Real-time voucher creation and redemption"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Multi-Party Support",
      description: "Support for buyers, sellers, and service providers"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Available worldwide with local payment methods"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CredoSafe</span>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-4"
            >
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#vouchers" className="text-gray-600 hover:text-blue-600 transition-colors">Vouchers</a>
              <a href="/landingpage/about" className="text-gray-600 hover:text-blue-600 transition-colors">About</a>
              <a href="/landingpage/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Welcome, {user?.name}</span>
                  <button 
                    onClick={() => {
                      dispatch(logoutUser());
                      dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
                    }}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => navigate('/signin')}
                    className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </button>
                  <button 
                    onClick={() => navigate('/signup')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
              </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.h1 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              className="text-5xl md:text-7xl font-bold text-gray-900 mb-6"
            >
              Secure Voucher
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Platform
              </span>
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Create, manage, and redeem secure vouchers for work orders, purchases, prepaid services, and gift cards. 
              Trust in our escrow protection and instant processing.
            </motion.p>
            <motion.div 
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button 
                onClick={() => {
                  if (isAuthenticated) {
                    // Navigate to dashboard for authenticated users
                    navigate('/dashboard');
                  } else {
                    dispatch(showToast({ 
                      message: 'Please sign in to access your dashboard', 
                      type: 'info' 
                    }));
                    navigate('/signin');
                  }
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{isAuthenticated ? 'Create Voucher' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                Learn More
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose CredoSafe?
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Built with security, speed, and simplicity in mind
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Voucher Types Section */}
      <section id="vouchers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              variants={fadeInUp}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Voucher Types
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Choose the perfect voucher type for your needs
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {voucherTypes.map((voucher, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${voucher.color} rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white">
                    {voucher.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{voucher.title}</h3>
                <p className="text-gray-600 mb-6">{voucher.description}</p>
                <ul className="space-y-2">
                  {voucher.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href={`/${voucher.title.toLowerCase().replace(/\s+/g, '-').replace('vouchers', 'vouchers')}`} className={`mt-6 bg-gradient-to-r ${voucher.color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 inline-block`}>
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 mb-8"
          >
            Join thousands of users who trust CredoSafe for their secure voucher needs
          </motion.p>
          <motion.button 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            onClick={() => {
              if (isAuthenticated) {
                navigate('/dashboard');
              } else {
                dispatch(showToast({ 
                  message: 'Please sign in to access your dashboard', 
                  type: 'info' 
                }));
                navigate('/signin');
              }
            }}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center space-x-2 mx-auto"
          >
            <span>{isAuthenticated ? 'Create Your First Voucher' : 'Get Started Today'}</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <span className="text-xl font-bold">CredoSafe</span>
              </div>
              <p className="text-gray-400">
                Secure voucher platform for all your payment needs
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Work Orders</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Purchase Escrow</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Prepaid Cards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/landingpage/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/landingpage/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/landingpage/contact" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/landingpage/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/landingpage/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/landingpage/privacy-policy" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/landingpage/privacy-policy" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CredoSafe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 