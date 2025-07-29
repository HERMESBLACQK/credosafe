import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import PrivacyPolicy from './pages/landingpage/PrivacyPolicy';
import TermsOfService from './pages/landingpage/TermsOfService';
import WorkOrderVouchers from './pages/landingpage/WorkOrderVouchers';
import PurchaseEscrowVouchers from './pages/landingpage/PurchaseEscrowVouchers';
import PrepaidVouchers from './pages/landingpage/PrepaidVouchers';
import GiftCardVouchers from './pages/landingpage/GiftCardVouchers';
import About from './pages/landingpage/About';
import Contact from './pages/landingpage/Contact';

function App() {
  return (
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
      </Routes>
    </Router>
  );
}

export default App;
