// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  Target, 
  Award, 
  Globe, 
  ArrowLeft,
  Heart,
  Zap,
  Lock,
  TrendingUp
} from 'lucide-react';

const About = () => {
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

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security First",
      description: "We prioritize the security of your transactions above everything else"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Trust & Transparency",
      description: "Building trust through complete transparency in all our operations"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Innovation",
      description: "Continuously innovating to provide the best user experience"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer Focus",
      description: "Your success and satisfaction are at the heart of everything we do"
    }
  ];

  const team = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/api/placeholder/150/150",
      bio: "Former fintech executive with 15+ years experience in secure payment systems"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "/api/placeholder/150/150",
      bio: "Blockchain and cybersecurity expert leading our technical innovation"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Product",
      image: "/api/placeholder/150/150",
      bio: "Product strategist focused on creating intuitive user experiences"
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image: "/api/placeholder/150/150",
      bio: "Cybersecurity specialist ensuring the highest level of protection"
    }
  ];

  const milestones = [
    {
      year: "2020",
      title: "Company Founded",
      description: "CredoSafe was founded with a vision to revolutionize secure payments"
    },
    {
      year: "2021",
      title: "First Voucher Launch",
      description: "Successfully launched our first work order voucher system"
    },
    {
      year: "2022",
      title: "100K Users",
      description: "Reached 100,000 active users across all voucher types"
    },
    {
      year: "2023",
      title: "Global Expansion",
      description: "Expanded to 50+ countries with local payment support"
    },
    {
      year: "2024",
      title: "1M Transactions",
      description: "Processed over 1 million secure transactions"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-neutral-200 sticky top-0 z-50">
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
            <motion.a 
              href="/"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </motion.a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 mb-6">
              About
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                {" "}CredoSafe
              </span>
            </h1>
            <p className="text-xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              We're on a mission to make secure payments accessible to everyone. 
              Our platform empowers individuals and businesses with trusted voucher solutions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-neutral-900 mb-6">
                Our Mission
              </h2>
              <p className="text-xl text-neutral-600 mb-6">
                To democratize secure financial transactions by providing accessible, 
                transparent, and trustworthy voucher solutions that protect both parties 
                in every transaction.
              </p>
              <p className="text-lg text-neutral-600 mb-8">
                We believe that everyone deserves access to secure payment methods, 
                regardless of their location or financial status. Our platform bridges 
                the gap between traditional banking and modern digital payments.
              </p>
              <div className="flex items-center space-x-4">
                <Target className="w-8 h-8 text-primary-600" />
                <span className="text-lg font-semibold text-neutral-900">
                  Building trust, one transaction at a time
                </span>
              </div>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary-500 to-accent-600 rounded-2xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-6">Our Vision</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Globe className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold">Global Reach</h4>
                    <p className="text-primary-100">Making secure payments available worldwide</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold">Uncompromising Security</h4>
                    <p className="text-primary-100">Bank-level protection for all transactions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <TrendingUp className="w-6 h-6 mt-1" />
                  <div>
                    <h4 className="font-semibold">Continuous Innovation</h4>
                    <p className="text-primary-100">Always improving our platform and services</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-neutral-50">
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
              className="text-4xl font-bold text-neutral-900 mb-4"
            >
              Our Values
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 max-w-2xl mx-auto"
            >
              The principles that guide everything we do
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-medium transition-all text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-4">{value.title}</h3>
                <p className="text-neutral-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
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
              className="text-4xl font-bold text-neutral-900 mb-4"
            >
              Meet Our Team
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 max-w-2xl mx-auto"
            >
              The passionate individuals behind CredoSafe
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-neutral-50 rounded-2xl p-6 text-center hover:shadow-soft transition-all"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">{member.name}</h3>
                <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                <p className="text-neutral-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-neutral-50">
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
              className="text-4xl font-bold text-neutral-900 mb-4"
            >
              Our Journey
            </motion.h2>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 max-w-2xl mx-auto"
            >
              Key milestones in our company's growth
            </motion.p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className={`flex items-center space-x-8 ${index % 2 === 1 ? 'flex-row-reverse space-x-reverse' : ''}`}
              >
                <div className="flex-1">
                  <div className={`bg-white rounded-2xl p-8 shadow-soft ${index % 2 === 1 ? 'text-right' : 'text-left'}`}>
                    <div className="text-3xl font-bold text-primary-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3">{milestone.title}</h3>
                    <p className="text-neutral-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.h2 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-4"
          >
            Join Us on Our Mission
          </motion.h2>
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-primary-100 mb-8"
          >
            Be part of the future of secure payments
          </motion.p>
          <motion.button 
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-white text-primary-600 px-8 py-4 rounded-lg hover:bg-neutral-100 transition-colors font-semibold"
          >
            Get Started Today
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-neutral-400">
            &copy; 2024 CredoSafe. All rights reserved. | 
            <a href="/privacy" className="text-primary-400 hover:text-primary-300 ml-2">Privacy Policy</a> | 
            <a href="/terms" className="text-primary-400 hover:text-primary-300 ml-2">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default About; 