// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Gift, 
  CheckCircle, 
  Heart, 
  Zap, 
  DollarSign, 
  Users,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';

const GiftCardVouchers = () => {
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

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Anonymous Sending",
      description: "Send gifts anonymously or with personalized messages"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Personalized Messages",
      description: "Add custom messages and greetings to your gift cards"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Flexible Amounts",
      description: "Choose any amount from ₦1 to ₦1,000 per gift card"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Delivery",
      description: "Digital delivery to email or phone number instantly"
    }
  ];

  const benefits = [
    "No shipping costs or delivery delays",
    "Secure digital delivery",
    "Personalized messaging options",
    "Flexible spending amounts",
    "Instant recipient notification",
    "Easy redemption process"
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Choose Design",
      description: "Select from beautiful gift card designs and themes",
      icon: <Gift className="w-8 h-8" />
    },
    {
      step: "2",
      title: "Add Message",
      description: "Include a personalized message or send anonymously",
      icon: <MessageSquare className="w-8 h-8" />
    },
    {
      step: "3",
      title: "Send Gift",
      description: "Deliver instantly via email or SMS to recipient",
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: "4",
      title: "Recipient Redeems",
      description: "Recipient can redeem at any participating business",
      icon: <CheckCircle className="w-8 h-8" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-pink-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <Gift className="w-8 h-8 text-pink-600" />
              <span className="text-xl font-bold text-gray-900">Gift Card Vouchers</span>
            </motion.div>
            <motion.a 
              href="/"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Gift Card
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-red-600">
                  {" "}Vouchers
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Send the perfect gift instantly. Choose from beautiful designs, add personalized messages, 
                and deliver digital gift cards that can be redeemed anywhere.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-pink-600 text-white px-8 py-4 rounded-lg hover:bg-pink-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2">
                  <span>Send Gift Card</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:border-pink-600 hover:text-pink-600 transition-all">
                  View Designs
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
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
              Key Features
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Everything you need to send the perfect digital gift
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
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-pink-600">
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

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
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
              How It Works
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Simple 4-step process for sending digital gift cards
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-pink-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Perfect for Every Occasion
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Send thoughtful gifts instantly for birthdays, holidays, anniversaries, 
                or just because. No shipping, no delays, just pure joy.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-pink-500 to-red-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Perfect For</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Heart className="w-6 h-6" />
                  <span>Birthdays & Anniversaries</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6" />
                  <span>Holidays & Special Events</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-6 h-6" />
                  <span>Friends & Family</span>
                </div>
                <div className="flex items-center space-x-3">
                  <EyeOff className="w-6 h-6" />
                  <span>Anonymous Gifts</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-600 to-red-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Send Joy Instantly
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-pink-100 mb-8"
          >
            Create and send beautiful digital gift cards to your loved ones
          </motion.p>
          <motion.button 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white text-pink-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center space-x-2 mx-auto"
          >
            <span>Send Gift Card</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
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

export default GiftCardVouchers; 