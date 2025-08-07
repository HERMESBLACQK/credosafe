import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

const QRCodeScanner = ({ onScan, onClose, onError }) => {
  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Initializing camera...');
  const readerId = 'qr-code-reader';
  useEffect(() => {
    html5QrCodeRef.current = new Html5Qrcode(readerId);

    const startScanner = async () => {
      try {
        await html5QrCodeRef.current.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            onScan(decodedText);
            stopScanner();
          },
          (errorMessage) => {
             // This callback is for continuous scanning feedback, not just errors
             if (!errorMessage.includes('No QR code found')) {
                setStatusMessage('Point camera at a QR code.');
             }
          }
        );
        setStatusMessage('Scanning...');
      } catch (err) {
        console.error('Error starting scanner:', err);
        setStatusMessage('Failed to start camera. Check permissions.');
        if (onError) onError('Failed to start camera.');
      }
    };

    const stopScanner = () => {
        if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
            html5QrCodeRef.current.stop().catch(err => console.error('Failed to stop scanner', err));
        }
    };

    if (isScannerActive) {
      startScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [isScannerActive, onScan, onError]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsScannerActive(false);
    setStatusMessage('Scanning file...');

    if (html5QrCodeRef.current) {
        html5QrCodeRef.current.scanFile(file, true)
        .then(decodedText => {
            onScan(decodedText);
        })
        .catch(err => {
            console.error('Error scanning file:', err);
            setStatusMessage('Could not read QR code from file.');
            if (onError) onError('Could not scan QR code from file.');
        })
        .finally(() => {
            if (fileInputRef.current) fileInputRef.current.value = '';
        });
    }
  };

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
        
        <div className="bg-gray-900 text-white p-4 rounded-lg min-h-[318px] flex flex-col items-center justify-center">
          <div id={readerId} className="w-full rounded-md overflow-hidden"></div>
          <p className="mt-2 text-sm text-gray-400">{statusMessage}</p>
        </div>

        <div className="flex items-center justify-center mt-4 space-x-4">
          <button 
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Upload Image
          </button>
          <button 
            onClick={() => setIsScannerActive(true)}
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Use Camera
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner;