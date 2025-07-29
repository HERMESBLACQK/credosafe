import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import LandingPage from './pages/landingpage/LandingPage';
import PrivacyPolicy from './pages/landingpage/PrivacyPolicy';
import TermsOfService from './pages/landingpage/TermsOfService';
import WorkOrderVouchers from './pages/landingpage/WorkOrderVouchers';
import PurchaseEscrowVouchers from './pages/landingpage/PurchaseEscrowVouchers';
import PrepaidVouchers from './pages/landingpage/PrepaidVouchers';
import GiftCardVouchers from './pages/landingpage/GiftCardVouchers';
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
        </Routes>
        <Toast />
      </Router>
    </Provider>
  );
}

export default App;
