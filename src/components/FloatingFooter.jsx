import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Plus,
  CreditCard,
  Settings,
  Wallet as WalletIcon,
  User
} from 'lucide-react';

const FloatingFooter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const navItems = [
    {
      label: 'Create',
      icon: <Plus className="w-6 h-6" />,
      route: '/create-voucher',
      active: isActive('/create-voucher') || isActive('/work-order-vouchers') || isActive('/purchase-escrow-vouchers') || isActive('/prepaid-vouchers') || isActive('/gift-card-vouchers')
    },
    {
      label: 'Wallet',
      icon: <WalletIcon className="w-6 h-6" />,
      route: '/wallet',
      active: isActive('/wallet')
    },
    {
      label: 'Redeem',
      icon: <CreditCard className="w-8 h-8" />,
      route: '/redeem',
      active: isActive('/redeem'),
      isCenter: true
    },
    {
      label: 'Settings',
      icon: <Settings className="w-6 h-6" />,
      route: '/settings',
      active: isActive('/settings')
    },
    {
      label: 'Profile',
      icon: <User className="w-6 h-6" />,
      route: '/dashboard',
      active: isActive('/dashboard')
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto px-4 pb-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-large p-4"
        >
          <div className="flex items-center justify-around">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.route)}
                className={`flex flex-col items-center space-y-1 transition-colors ${
                  item.active 
                    ? 'text-primary-600' 
                    : 'text-neutral-600 hover:text-primary-600'
                }`}
              >
                <div className={`${
                  item.isCenter 
                    ? 'w-16 h-16 -mt-6' 
                    : 'w-12 h-12'
                } ${
                  item.active
                    ? item.isCenter
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600'
                      : 'bg-primary-100'
                    : item.isCenter
                      ? 'bg-gradient-to-r from-primary-600 to-accent-600'
                      : 'bg-neutral-100'
                } ${
                  item.isCenter ? 'rounded-full' : 'rounded-xl'
                } flex items-center justify-center ${
                  item.active && !item.isCenter ? 'text-primary-600' : ''
                } ${
                  item.isCenter ? 'text-white' : ''
                }`}>
                  {item.icon}
                </div>
                <span className={`text-xs font-medium ${
                  item.active ? 'text-primary-600' : 'text-neutral-600'
                }`}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FloatingFooter; 