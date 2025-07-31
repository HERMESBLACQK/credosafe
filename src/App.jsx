import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LandingPage from './pages/landingpage/LandingPage';
import PrivacyPolicy from './pages/landingpage/PrivacyPolicy';
import TermsOfService from './pages/landingpage/TermsOfService';

import About from './pages/landingpage/About';
import Contact from './pages/landingpage/Contact';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import Redeem from './pages/Redeem';
import Profile from './pages/Profile';
import CreateVoucher from './pages/CreateVoucher';
import Transactions from './pages/Transactions';
import ChangePassword from './pages/ChangePassword';
import LoginHistory from './pages/LoginHistory';
import DeviceManagement from './pages/DeviceManagement';
import WorkOrderVouchers from './pages/WorkOrderVouchers';
import PurchaseEscrowVouchers from './pages/PurchaseEscrowVouchers';
import PrepaidVouchers from './pages/PrepaidVouchers';
import GiftCardVouchers from './pages/GiftCardVouchers';
import WalletTransactions from './pages/WalletTransactions';
import Tier from './pages/Tier';
import VoucherPreview from './pages/VoucherPreview';
import RedeemVoucher from './pages/RedeemVoucher';
import MyVouchers from './pages/MyVouchers';
import Toast from './components/Toast';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/work-order-vouchers" element={<WorkOrderVouchers />} />
          <Route path="/purchase-escrow-vouchers" element={<PurchaseEscrowVouchers />} />
          <Route path="/prepaid-vouchers" element={<PrepaidVouchers />} />
          <Route path="/gift-card-vouchers" element={<GiftCardVouchers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/redeem" element={<Redeem />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-voucher" element={<CreateVoucher />} />
          <Route path="/transactions" element={<Transactions />} />
                                <Route path="/change-password" element={<ChangePassword />} />
                      <Route path="/login-history" element={<LoginHistory />} />
                      <Route path="/device-management" element={<DeviceManagement />} />
                                <Route path="/wallet-transactions" element={<WalletTransactions />} />
          <Route path="/tier" element={<Tier />} />
          <Route path="/voucher-preview/:voucherId" element={<VoucherPreview />} />
          <Route path="/redeem-voucher" element={<RedeemVoucher />} />
          <Route path="/my-vouchers" element={<MyVouchers />} />
        </Routes>
        <Toast />
      </Router>
    </Provider>
  );
}

export default App;
