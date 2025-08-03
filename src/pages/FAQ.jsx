import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  ArrowLeft,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import FloatingFooter from '../components/FloatingFooter';

const FAQ = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const faqData = [
    {
      id: 1,
      question: "What is CredoSafe?",
      answer: "CredoSafe is a secure digital voucher and escrow platform that enables safe transactions between parties. We provide various types of vouchers including work order vouchers, purchase escrow vouchers, gift cards, and prepaid vouchers."
    },
    {
      id: 2,
      question: "How do I create a voucher?",
      answer: "To create a voucher, navigate to the 'Create Voucher' section and select the type of voucher you want to create. Fill in the required details including amount, recipient information, and any specific terms. You can choose from Work Order, Purchase Escrow, Gift Card, or Prepaid voucher types."
    },
    {
      id: 3,
      question: "How does wallet funding work?",
      answer: "You can fund your wallet using our secure Flutterwave payment gateway. Click on 'Fund Wallet' and enter the amount you want to add. You'll be redirected to a secure payment page where you can choose your preferred payment method."
    },
    {
      id: 4,
      question: "How do I withdraw money from my wallet?",
      answer: "To withdraw funds, go to your wallet and click 'Withdraw'. Enter the amount, select your bank, and provide your account details. We'll verify your account and process the withdrawal within 24 hours."
    },
    {
      id: 5,
      question: "What are the different voucher types?",
      answer: "We offer four main voucher types: 1) Work Order Vouchers - for project milestones and deliverables, 2) Purchase Escrow Vouchers - for secure buying and selling, 3) Gift Card Vouchers - for gifting purposes, 4) Prepaid Vouchers - for advance payments."
    },
    {
      id: 6,
      question: "How secure is my information?",
      answer: "We use industry-standard encryption and security measures to protect your data. All transactions are secured with SSL encryption, and we implement strict authentication protocols to ensure your information remains safe."
    },
    {
      id: 7,
      question: "What happens if a voucher expires?",
      answer: "Expired vouchers are automatically cancelled and funds are returned to the voucher creator's wallet. You can also manually cancel vouchers before expiration if needed."
    },
    {
      id: 8,
      question: "How do I track my transactions?",
      answer: "You can view all your transactions in the 'Transactions' section. This includes wallet funding, withdrawals, voucher creations, and redemptions with detailed timestamps and status information."
    },
    {
      id: 9,
      question: "Can I cancel a voucher?",
      answer: "Yes, voucher creators can cancel vouchers before they are redeemed. Once cancelled, the funds are returned to the creator's wallet. Recipients can also confirm cancellation for refunds."
    },
    {
      id: 10,
      question: "What are the fees?",
      answer: "We charge minimal transaction fees for wallet funding and withdrawals. Voucher creation and redemption are generally free. Specific fee structures are displayed during the transaction process."
    }
  ];

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
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
              onClick={() => navigate('/settings')}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Settings</span>
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
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <HelpCircle className="w-16 h-16 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-4">Frequently Asked Questions</h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Find answers to common questions about CredoSafe. Can't find what you're looking for? 
              Contact our support team below.
            </p>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-2xl shadow-soft mb-8">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">Common Questions</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {faqData.map((faq) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: faq.id * 0.1 }}
                  className="p-6"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between text-left hover:bg-neutral-50 p-4 rounded-lg transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 pr-4">
                      {faq.question}
                    </h3>
                    {openFaq === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pl-4 pr-4 pb-4"
                    >
                      <p className="text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-soft">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-bold text-neutral-900">Contact Support</h2>
              <p className="text-neutral-600 mt-2">
                Need help? Our support team is here to assist you.
              </p>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Methods */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
                    <Mail className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-neutral-900">Email Support</p>
                      <p className="text-sm text-neutral-600">support@credosafe.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
                    <Phone className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-neutral-900">Phone Support</p>
                      <p className="text-sm text-neutral-600">+234 800 123 4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-neutral-900">Live Chat</p>
                      <p className="text-sm text-neutral-600">Available 24/7</p>
                    </div>
                  </div>
                </div>

                {/* Office Information */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-neutral-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary-600 mt-1" />
                    <div>
                      <p className="font-medium text-neutral-900">Office Address</p>
                      <p className="text-sm text-neutral-600">
                        123 Innovation Drive<br />
                        Lagos, Nigeria<br />
                        Postal Code: 100001
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
                    <Clock className="w-5 h-5 text-primary-600" />
                    <div>
                      <p className="font-medium text-neutral-900">Business Hours</p>
                      <p className="text-sm text-neutral-600">
                        Monday - Friday: 8:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 3:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/wallet')}
                    className="flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Go to Wallet</span>
                  </button>
                  <button
                    onClick={() => navigate('/vouchers')}
                    className="flex items-center justify-center space-x-2 bg-neutral-600 text-white py-3 px-6 rounded-lg hover:bg-neutral-700 transition-colors"
                  >
                    <HelpCircle className="w-5 h-5" />
                    <span>View Vouchers</span>
                  </button>
                </div>
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

export default FAQ; 