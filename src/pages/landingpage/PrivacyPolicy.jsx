import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Users, Globe, ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
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
      icon: <Database className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal information (name, email, phone number)",
        "Payment information (securely encrypted)",
        "Transaction history and voucher details",
        "Device and usage information",
        "Cookies and similar technologies"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "Process transactions and manage vouchers",
        "Provide customer support and services",
        "Improve our platform and user experience",
        "Comply with legal obligations",
        "Send important updates and notifications"
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Information Sharing",
      content: [
        "We do not sell your personal information",
        "Share only with your explicit consent",
        "Comply with legal requirements",
        "Protect against fraud and abuse",
        "Work with trusted service providers"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "Bank-level encryption for all data",
        "Regular security audits and updates",
        "Secure data centers and infrastructure",
        "Access controls and authentication",
        "24/7 monitoring and threat detection"
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "International Transfers",
      content: [
        "Data may be processed globally",
        "Compliance with local data laws",
        "Adequate protection measures",
        "Transparent data handling practices",
        "User consent for cross-border transfers"
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Access your personal information",
        "Correct inaccurate data",
        "Request data deletion",
        "Opt-out of marketing communications",
        "File complaints with authorities"
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
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              At CredoSafe, we are committed to protecting your privacy and ensuring the security of your personal information. 
              This policy explains how we collect, use, and safeguard your data.
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
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> privacy@credosafe.com</p>
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

export default PrivacyPolicy; 