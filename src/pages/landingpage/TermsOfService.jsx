// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Shield, FileText, Scale, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
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

  const sections = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using CredoSafe, you accept and agree to be bound by these terms",
        "If you disagree with any part of these terms, you may not access our service",
        "We reserve the right to modify these terms at any time",
        "Continued use after changes constitutes acceptance of new terms",
        "You are responsible for reviewing terms regularly"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Service Description",
      content: [
        "CredoSafe provides secure voucher creation and management services",
        "We facilitate escrow protection for various transaction types",
        "Services include work order, purchase, prepaid, and gift card vouchers",
        "We act as an intermediary, not a party to your transactions",
        "All transactions are subject to our security and verification processes"
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "User Responsibilities",
      content: [
        "Provide accurate and complete information",
        "Maintain the security of your account credentials",
        "Comply with all applicable laws and regulations",
        "Not use the service for illegal or fraudulent activities",
        "Report any suspicious activity immediately"
      ]
    },
    {
      icon: <AlertTriangle className="w-6 h-6" />,
      title: "Prohibited Activities",
      content: [
        "Creating fake or fraudulent vouchers",
        "Attempting to circumvent security measures",
        "Using the service for money laundering",
        "Harassing or threatening other users",
        "Violating intellectual property rights"
      ]
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Fees and Payments",
      content: [
        "Transaction fees apply to voucher creation and redemption",
        "Fees are clearly displayed before transaction completion",
        "All fees are non-refundable unless required by law",
        "We may change fees with 30 days notice",
        "Payment methods are subject to availability and verification"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Dispute Resolution",
      content: [
        "Users must attempt to resolve disputes directly first",
        "CredoSafe may mediate disputes at our discretion",
        "Escrow funds are held until resolution is reached",
        "We may freeze accounts during investigation",
        "Final decisions are binding on all parties"
      ]
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
            <motion.a 
              href="/"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              These terms govern your use of CredoSafe's voucher platform. Please read them carefully 
              before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {sections.map((section, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="border-b border-gray-200 pb-16 last:border-b-0"
              >
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-blue-600">
                      {section.icon}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Important Notice */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-16 p-8 bg-yellow-50 border border-yellow-200 rounded-2xl"
          >
            <div className="flex items-start space-x-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Important Notice
                </h3>
                <p className="text-gray-700 mb-4">
                  These terms constitute a legally binding agreement between you and CredoSafe. 
                  By using our services, you acknowledge that you have read, understood, and agree 
                  to be bound by these terms.
                </p>
                <p className="text-gray-700">
                  If you have any questions about these terms, please contact our legal team before 
                  using our services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="mt-16 p-8 bg-blue-50 rounded-2xl"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h3>
            <p className="text-gray-700 mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> legal@credosafe.com</p>
              <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              <p><strong>Address:</strong> 123 Security Street, Trust City, TC 12345</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            &copy; 2024 CredoSafe. All rights reserved. | 
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 ml-2">Privacy Policy</a> | 
            <a href="/terms" className="text-blue-400 hover:text-blue-300 ml-2">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService; 