// import { motion } from 'framer-motion'; // Temporarily disabled for landing page
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
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
  Menu,
  X
} from 'lucide-react';

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Animation variants removed for cleaner code

  const voucherTypes = [
    {
      icon: <Handshake className="w-8 h-8" />,
      title: "Work Order Vouchers",
      description: "Create milestone-based or full payment vouchers for work orders. Redeem upon completion.",
      features: ["Milestone payments", "Full payment options", "Escrow protection", "Completion verification"],
      color: "from-blue-500 to-blue-600",
      path: "/landingpage/work-order-vouchers"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Purchase Escrow Vouchers",
      description: "Secure transactions with escrow protection. Both parties must agree before release.",
      features: ["Escrow protection", "Dual approval", "Secure transactions", "Dispute resolution"],
      color: "from-green-500 to-green-600",
      path: "/landingpage/purchase-escrow-vouchers"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "Prepaid Vouchers",
      description: "Load funds and use at participating businesses. Instant redemption available.",
      features: ["Prepaid balance", "Business network", "Instant redemption", "Balance tracking"],
      color: "from-purple-500 to-purple-600",
      path: "/landingpage/prepaid-vouchers"
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: "Gift Card Vouchers",
      description: "Send anonymous or personalized gift cards. Flexible redemption options.",
      features: ["Anonymous sending", "Personalized messages", "Flexible amounts", "Digital delivery"],
      color: "from-pink-500 to-pink-600",
      path: "/landingpage/gift-card-vouchers"
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
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">CredoSafe</span>
            </div>
            <div className="flex items-center">
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#vouchers" className="text-gray-600 hover:text-blue-600 transition-colors">Vouchers</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</a>
              <span className="text-gray-300">|</span>
              <button onClick={() => navigate('/signin')} className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
                <button onClick={() => navigate('/signup')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-600">
                  {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#features" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Features</a>
              <a href="#vouchers" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Vouchers</a>
              <a href="#contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50">Contact</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="px-5 space-y-2">
                <button onClick={() => { navigate('/signin'); setIsMenuOpen(false); }} className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg border border-gray-300">
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
                <button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Secure Voucher
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create, manage, and redeem secure vouchers for work orders, purchases, prepaid services, and gift cards. 
              Trust in our escrow protection and instant processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/landingpage/redeem-public')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Redeem</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 

            className="text-center mb-16"
          >
            <h2 

              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Why Choose CredoSafe?
            </h2>
            <p 

              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Built with security, speed, and simplicity in mind
            </p>
          </div>
          
          <div 

            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <div
                key={index}

                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voucher Types Section */}
      <section id="vouchers" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 

            className="text-center mb-16"
          >
            <h2 

              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Voucher Types
            </h2>
            <p 

              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Choose the perfect voucher type for your needs
            </p>
          </div>

          <div 

            className="grid md:grid-cols-2 gap-8"
          >
            {voucherTypes.map((voucher, index) => (
              <div 
                key={index}

                onClick={() => navigate(voucher.path)}
                className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
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
                <button 
                  onClick={() => {
                    const route = voucher.title.toLowerCase().replace(/\s+/g, '-').replace('vouchers', 'vouchers');
                    navigate(`/landingpage/${route}`);
                  }}
                  className={`mt-6 bg-gradient-to-r ${voucher.color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center space-x-2`}
                >
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 
            
            className="text-4xl font-bold text-white mb-4"
          >
            Ready to Get Started?
          </h2>
          <p 
            
            
            className="text-xl text-blue-100 mb-8"
          >
            Join thousands of users who trust CredoSafe for their secure voucher needs
          </p>
          <button 
            
            
            onClick={() => navigate('/signin')}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center space-x-2 mx-auto"
          >
            <span>Get Started Today</span>
            <ArrowRight className="w-5 h-5" />
          </button>
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
                <li><a href="/landingpage/work-order-vouchers" className="hover:text-white transition-colors">Work Orders</a></li>
                <li><a href="/landingpage/purchase-escrow-vouchers" className="hover:text-white transition-colors">Purchase Escrow</a></li>
                <li><a href="/landingpage/prepaid-vouchers" className="hover:text-white transition-colors">Prepaid Cards</a></li>
                <li><a href="/landingpage/gift-card-vouchers" className="hover:text-white transition-colors">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/landingpage/about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/landingpage/contact" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="/landingpage/contact" className="hover:text-white transition-colors">Support</a></li>
                <li><a href="/landingpage/blog" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/landingpage/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/landingpage/terms-of-service" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/landingpage/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/landingpage/gdpr" className="hover:text-white transition-colors">GDPR</a></li>
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