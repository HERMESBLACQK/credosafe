import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';

// Pages
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import GiftCardVouchers from './pages/GiftCardVouchers';
import PrepaidVouchers from './pages/PrepaidVouchers';
import PurchaseEscrowVouchers from './pages/PurchaseEscrowVouchers';
import WorkOrderVouchers from './pages/WorkOrderVouchers';
import Redeem from './pages/Redeem';
import VoucherPreview from './pages/VoucherPreview';
import Tier from './pages/Tier';
import ChangePassword from './pages/ChangePassword';
import RedeemVoucher from './pages/RedeemVoucher';
import Settings from './pages/Settings';
import CreateVoucher from './pages/CreateVoucher';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import DeviceManagement from './pages/DeviceManagement';
import WalletTransactions from './pages/WalletTransactions';

// Components
import PrivateRoute from './components/PrivateRoute';
import { LoadingProvider } from './contexts/LoadingContext';

// Enhanced loading component for persistence
const PersistenceLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-neutral-600 font-medium">Loading your secure session...</p>
      <p className="text-sm text-neutral-500 mt-2">Please wait while we restore your data</p>
    </div>
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistenceLoader />} persistor={persistor}>
        <LoadingProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Protected Routes */}
                <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
                <Route path="/gift-card" element={<PrivateRoute><GiftCardVouchers /></PrivateRoute>} />
                <Route path="/prepaid" element={<PrivateRoute><PrepaidVouchers /></PrivateRoute>} />
                <Route path="/purchase-escrow" element={<PrivateRoute><PurchaseEscrowVouchers /></PrivateRoute>} />
                <Route path="/work-order" element={<PrivateRoute><WorkOrderVouchers /></PrivateRoute>} />
                <Route path="/redeem" element={<PrivateRoute><Redeem /></PrivateRoute>} />
                <Route path="/voucher-preview/:id" element={<PrivateRoute><VoucherPreview /></PrivateRoute>} />
                <Route path="/voucher/:id" element={<PrivateRoute><VoucherPreview /></PrivateRoute>} />
                <Route path="/tier" element={<PrivateRoute><Tier /></PrivateRoute>} />
                <Route path="/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
                <Route path="/redeem-voucher/:id" element={<PrivateRoute><RedeemVoucher /></PrivateRoute>} />
                <Route path="/redeem-voucher" element={<PrivateRoute><RedeemVoucher /></PrivateRoute>} />
                <Route path="/create-voucher" element={<PrivateRoute><CreateVoucher /></PrivateRoute>} />
                <Route path="/wallet" element={<PrivateRoute><Wallet /></PrivateRoute>} />
                <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/device-management" element={<PrivateRoute><DeviceManagement /></PrivateRoute>} />
                <Route path="/wallet-transactions" element={<PrivateRoute><WalletTransactions /></PrivateRoute>} />
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </LoadingProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
