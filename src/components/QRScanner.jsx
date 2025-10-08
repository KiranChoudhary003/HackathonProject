import { useState, useRef, useEffect } from 'react';
import { QrCode, X, Check, AlertCircle } from 'lucide-react';
import { scanUserAPI } from '../utils/mockApi';

const QRScanner = ({ onScan, onClose, currentUserId }) => {
  const videoRef = useRef(null);
  const [scanner, setScanner] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.destroy();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      
      // Import QRScanner dynamically
      const QrScanner = (await import('qr-scanner')).default;
      
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => handleScanResult(result.data),
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 5,
        }
      );

      setScanner(qrScanner);
      await qrScanner.start();
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      setError('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.destroy();
      setScanner(null);
    }
    setIsScanning(false);
    setScanResult(null);
    setError(null);
  };

  const handleScanResult = async (scannedUserId) => {
    if (!scannedUserId || scannedUserId === currentUserId) {
      setError('Invalid QR code or cannot scan your own code');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the mock API (replace with real API call)
      const result = await scanUserAPI({
        scannerUserId: currentUserId,
        scannedUserId: scannedUserId,
        timestamp: new Date().toISOString()
      });

      if (result.success) {
        setScanResult({
          scannedUserId,
          message: 'QR code scanned successfully!',
          timestamp: new Date().toLocaleString(),
          scanId: result.data.scanId
        });
        
        // Call the onScan callback if provided
        if (onScan) {
          onScan({
            scannerUserId: currentUserId,
            scannedUserId,
            timestamp: new Date().toISOString(),
            scanId: result.data.scanId
          });
        }
      } else {
        throw new Error('Failed to process scan');
      }
    } catch (err) {
      console.error('Error processing scan:', err);
      setError('Failed to process scan. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  const retryScan = () => {
    setScanResult(null);
    setError(null);
    if (scanner) {
      scanner.start();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">Scan QR Code</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {!isScanning && !scanResult && !error && (
              <div className="text-center py-6 sm:py-8">
                <div className="text-blue-600 mb-4">
                  <QrCode size={40} className="sm:w-12 sm:h-12 mx-auto mb-2" />
                  <p className="font-medium text-sm sm:text-base">Ready to Scan</p>
                </div>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Click "Start Scanning" to scan another user's QR code
                </p>
                <button
                  onClick={startScanning}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Start Scanning
                </button>
              </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover rounded-lg bg-gray-900"
                />
                <div className="absolute inset-0 border-4 border-blue-500 rounded-lg pointer-events-none">
                  <div className="absolute top-4 left-4 right-4 h-8 bg-gradient-to-b from-blue-500 to-transparent rounded-t-lg"></div>
                  <div className="absolute bottom-4 left-4 right-4 h-8 bg-gradient-to-t from-blue-500 to-transparent rounded-b-lg"></div>
                </div>
                {isProcessing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="font-medium">Processing...</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-3">
                  Point your camera at a QR code to scan
                </p>
                <button
                  onClick={stopScanning}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Stop Scanning
                </button>
              </div>
            </div>
          )}

          {scanResult && (
            <div className="text-center py-8">
              <div className="text-green-600 mb-4">
                <Check size={48} className="mx-auto mb-2" />
                <p className="font-medium text-lg">Scan Successful!</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-medium">{scanResult.message}</p>
                <p className="text-green-600 text-sm mt-1">
                  User ID: {scanResult.scannedUserId}
                </p>
                <p className="text-green-600 text-sm">
                  Time: {scanResult.timestamp}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={retryScan}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Scan Another
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <div className="text-red-600 mb-4">
                <AlertCircle size={48} className="mx-auto mb-2" />
                <p className="font-medium">Scan Failed</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={retryScan}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
