import React, { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRCodeScanner = ({ onScan, onClose, onError }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'qr-code-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        supportedScanTypes: [0, 1] // 0 for camera, 1 for file
      },
      false // verbose
    );

    let isScanning = true;

    const handleSuccess = (decodedText, decodedResult) => {
      if (isScanning) {
        console.log(`Scan result: ${decodedText}`, decodedResult);
        isScanning = false; // Prevent multiple scans
        scanner.clear();
        onScan(decodedText);
      }
    };

    const handleError = (errorMessage) => {
      // Don't log 'QR code parse error', it's too frequent
      if (!errorMessage.includes('QR code parse error')) {
        console.error(`QR Scanner Error: ${errorMessage}`);
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    scanner.render(handleSuccess, handleError);

    // Cleanup function to stop the scanner
    return () => {
      if (scanner) {
        scanner.clear().catch(error => {
          console.error('Failed to clear html5-qrcode-scanner.', error);
        });
      }
    };
  }, [onScan, onError]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full relative transform transition-all duration-300 scale-95 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close scanner"
          >
            <X size={24} />
          </button>
        </div>
        
        <div id="qr-code-reader" className="w-full"></div>

        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Point your camera at the QR code.</p>
          <p>You can also upload an image using the button in the scanner view.</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;