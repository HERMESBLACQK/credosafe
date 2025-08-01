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
    
    // Simple QR code detection (you might want to use a proper QR library)
    // For now, we'll use a basic pattern matching approach
    const qrCode = detectQRCode(imageData);
    
    if (qrCode) {
      stopScanning();
      onScan(qrCode);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Camera Scanner */}
          <div className="relative">
            <video
              ref={videoRef}
              className={`w-full h-64 bg-gray-100 rounded ${isScanning ? 'block' : 'hidden'}`}
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
            
            {!isScanning && (
              <div className="w-full h-64 bg-gray-100 rounded flex items-center justify-center">
                <div className="text-center">
                  <Camera size={48} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">Camera will activate when scanning starts</p>
                </div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex space-x-3">
            {!isScanning ? (
              <button
                onClick={startScanning}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <Scan size={20} />
                <span>Start Scanning</span>
              </button>
            ) : (
              <button
                onClick={stopScanning}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
              >
                Stop Scanning
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <Upload size={20} />
              <span>{isUploading ? 'Processing...' : 'Upload Image'}</span>
            </button>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Instructions */}
          <div className="text-sm text-gray-600">
            <p className="mb-2">📱 Point your camera at a QR code or upload an image containing a QR code</p>
            <p>💡 Make sure the QR code is clearly visible and well-lit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeScanner; 