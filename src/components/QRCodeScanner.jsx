import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Scan } from 'lucide-react';
import jsQR from 'jsqr';

const QRCodeScanner = ({ onScan, onClose, onError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize QR code scanner
  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        
        // Start scanning for QR codes
        scanQRCode();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera access or use image upload.');
      setIsScanning(false);
      if (onError) onError('Camera access denied');
    }
  };

  // Stop scanning
  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  // Scan QR code from video stream
  const scanQRCode = () => {
    if (!isScanning || !videoRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas size to match video
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Draw video frame to canvas
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    
    // Get image data for QR code detection
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
    // QR code detection using jsQR library
    const qrCode = detectQRCode(imageData);
    
    if (qrCode) {
      console.log('QR Code detected:', qrCode);
      // Don't stop scanning immediately, let user confirm or continue
      // This allows reusing the same QR code
      onScan(qrCode);
      // Continue scanning for more QR codes
      setTimeout(() => {
        if (isScanning) {
          requestAnimationFrame(scanQRCode);
        }
      }, 1000); // Wait 1 second before scanning again
    } else {
      // Continue scanning
      requestAnimationFrame(scanQRCode);
    }
  };

  // QR code detection using jsQR library
  const detectQRCode = (imageData) => {
    try {
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code) {
        console.log('QR Code detected:', code.data);
        return code.data;
      }
      return null;
    } catch (error) {
      console.error('QR code detection error:', error);
      return null;
    }
  };

  // Handle file upload for QR code detection
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const qrCode = detectQRCode(imageData);
        
        if (qrCode) {
          onScan(qrCode);
        } else {
          setError('No QR code found in the image. Please try another image.');
          if (onError) onError('No QR code found in image');
        }
        
        setIsUploading(false);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Camera Scanner */}
        <div className="p-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className={`w-full h-48 sm:h-64 object-cover ${isScanning ? 'block' : 'hidden'}`}
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {!isScanning && (
              <div className="w-full h-48 sm:h-64 flex items-center justify-center">
                <div className="text-center">
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500 text-sm">Camera will activate when scanning starts</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 pb-4 space-y-3">
          {!isScanning ? (
            <button
              onClick={startScanning}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
            >
              <Scan size={18} />
              <span>Start Camera Scan</span>
            </button>
          ) : (
            <button
              onClick={stopScanning}
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Stop Scanning
            </button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 font-medium"
          >
            <Upload size={18} />
            <span>{isUploading ? 'Processing...' : 'Upload Image'}</span>
          </button>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {/* Instructions */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-blue-800 text-sm font-medium mb-1">💡 Tips for better scanning:</p>
            <ul className="text-blue-700 text-xs space-y-1">
              <li>• Ensure QR code is clearly visible and well-lit</li>
              <li>• Hold camera steady and close to the QR code</li>
              <li>• You can scan the same QR code multiple times</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 