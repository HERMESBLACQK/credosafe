import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, LogIn, AlertCircle } from 'lucide-react';


const RedeemVoucher = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const voucherData = location.state?.voucherData;
  const voucherCode = location.state?.voucherCode;
  const error = location.state?.error || null;

  useEffect(() => {
    if (!voucherData) {
      // If no voucher data, redirect back to redeem page
      navigate('/landingpage/redeem', { replace: true });
    }
    // eslint-disable-next-line
  }, [voucherData]);

  const handleRedeemClick = () => {
    // Redirect to login page for authentication
    navigate('/login');
  };

  if (!voucherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50">
        <div className="max-w-md w-full p-6">
          <ErrorMessage 
            message={error || "No voucher data found. Please try again or check your voucher code."} 
            onRetry={() => navigate('/landingpage/redeem', { replace: true })}
            onClose={() => navigate('/landingpage/redeem', { replace: true })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center pb-24">
      {error && (
        <div className="max-w-md mx-auto pt-4">
          <ErrorMessage 
            message={error} 
            onRetry={() => navigate('/landingpage/redeem', { replace: true })}
            onClose={() => navigate('/landingpage/redeem', { replace: true })}
          />
        </div>
      )}
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <CreditCard className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Voucher Details</h1>
            <p className="text-lg text-gray-600">Preview your voucher details before redeeming</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-purple-100">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
              <div className="col-span-2">
                <span className="text-gray-500 text-xs font-semibold">Voucher Code:</span>
                <span className="block font-mono text-lg text-purple-700 tracking-wider bg-purple-50 rounded px-2 py-1 mt-1">{voucherCode}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-semibold">Amount:</span>
                <span className="block font-bold text-2xl text-blue-700">₦{voucherData.available_amount?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-semibold">Status:</span>
                <span className={`block font-semibold text-base capitalize rounded px-2 py-1 mt-1 ${voucherData.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{voucherData.status}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-semibold">Recipient:</span>
                <span className="block font-medium text-gray-800">{voucherData.recipient_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs font-semibold">Type:</span>
                <span className="block font-medium text-gray-800 capitalize">{voucherData.type}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500 text-xs font-semibold">Created On:</span>
                <span className="block font-medium text-gray-700">{new Date(voucherData.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>

            {voucherData.milestones && voucherData.milestones.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-purple-800 mb-4">Milestones</h3>
                <div className="overflow-x-auto rounded-lg border border-purple-200 bg-purple-50">
                  <table className="min-w-full divide-y divide-purple-200">
                    <thead className="bg-purple-100">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-purple-600 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-purple-600 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-bold text-purple-600 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-purple-100">
                      {voucherData.milestones.map((milestone, index) => (
                        <tr key={index} className="hover:bg-purple-50 transition">
                          <td className="px-4 py-3 whitespace-nowrap text-base font-semibold text-gray-900">{milestone.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-blue-700 font-bold">₦{milestone.amount?.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base">
                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${milestone.status === 'completed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{milestone.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border border-blue-200 rounded-2xl p-5 mb-8 flex items-start space-x-4 shadow-sm">
              <AlertCircle className="w-7 h-7 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <div className="font-bold text-blue-900 mb-1 text-lg">Redeem this voucher</div>
                <div className="text-blue-800 text-base">To redeem this voucher, please log in or create an account. You will be redirected to the login page.</div>
              </div>
            </div>
            <button
              onClick={handleRedeemClick}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-4 px-4 rounded-xl hover:from-blue-700 hover:to-pink-700 transition-all font-extrabold flex items-center justify-center space-x-3 text-lg shadow-lg"
            >
              <LogIn className="w-6 h-6" />
              <span>Login to Redeem</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RedeemVoucher;
