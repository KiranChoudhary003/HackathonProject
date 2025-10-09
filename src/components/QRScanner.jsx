// import { useEffect, useRef, useState } from 'react';
// import { X, Camera, AlertCircle } from 'lucide-react';
// import { postJSON } from '../utils/apiClient';
// import { useAuth } from '../context/AuthContext';
// import { decodeJWT } from '../utils/googleAuth';
// import jsQR from 'jsqr';

// // Real QR code detection using jsQR
// const detectQRCode = (imageData) => {
//   const code = jsQR(imageData.data, imageData.width, imageData.height);
//   if (code && code.data) {
//     const qrContent = code.data;
//     try {
//       // If QR code contains stringified JSON
//       const obj = JSON.parse(qrContent);
//       if (obj.doctorId) {
//         return {
//           doctorId: obj.doctorId,
//           timestamp: new Date().toISOString(),
//           type: 'doctor_qr',
//         };
//       }
//     } catch {
//       // fallback: code is just the doctorId or doctorId=123
//       if (qrContent.startsWith('doctorId=')) {
//         return {
//           doctorId: qrContent.replace('doctorId=', ''),
//           timestamp: new Date().toISOString(),
//           type: 'doctor_qr',
//         };
//       }
//       // Or the QR code is literally just the numeric/string ID
//       return {
//         doctorId: qrContent,
//         timestamp: new Date().toISOString(),
//         type: 'doctor_qr',
//       };
//     }
//   }
//   return null;
// };

// // Mock QR code data for testing
// const mockQRData = {
//   doctorId: '1',
//   timestamp: new Date().toISOString(),
//   type: 'doctor_qr'
// };

// function QRScanner({ onClose, onScanSuccess }) {
//   const videoRef = useRef(null);
//   const canvasRef = useRef(null);
//   const { token, user } = useAuth();
//   const [scanning, setScanning] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(false);
//   const [scanInterval, setScanInterval] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   // Get patient ID from authenticated user
//   let patientId = null;
//   if (token) {
//     const decoded = decodeJWT(token);
//     patientId = decoded?.id || decoded?.patient_id || user?.id;
//   }

//   useEffect(() => {
//     if (!patientId) {
//       setError('Please log in to scan QR codes');
//       return;
//     }

//     startCamera();
//     return () => {
//       stopCamera();
//       if (scanInterval) {
//         clearInterval(scanInterval);
//       }
//     };
//   }, [patientId]);

//   const startCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: 'environment' } // Use back camera
//       });
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         setScanning(true);
//         setError(null);
        
//         // Start continuous scanning
//         const interval = setInterval(() => {
//           scanQRCode();
//         }, 100); // Scan every 100ms
        
//         setScanInterval(interval);
//       }
//     } catch (err) {
//       console.error('Camera access error:', err);
//       setError('Camera access denied. Please allow camera access to scan QR codes.');
//     }
//   };

//   const stopCamera = () => {
//     if (scanInterval) {
//       clearInterval(scanInterval);
//       setScanInterval(null);
//     }
//     if (videoRef.current && videoRef.current.srcObject) {
//       const tracks = videoRef.current.srcObject.getTracks();
//       tracks.forEach(track => track.stop());
//       videoRef.current.srcObject = null;
//     }
//     setScanning(false);
//   };

//   const scanQRCode = () => {
//     if (!videoRef.current || !canvasRef.current || !scanning || isProcessing) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const context = canvas.getContext('2d');

//     // Check if video is ready
//     if (video.readyState !== video.HAVE_ENOUGH_DATA) return;

//     // Set canvas size to match video
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;

//     // Draw video frame to canvas
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);

//     // Get image data
//     const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    
//     // Try to detect QR code
//     const qrData = detectQRCode(imageData);
    
//     if (qrData) {
//       handleQRScan(qrData);
//     }
//   };

//   const handleQRScan = async (qrData) => {
//     if (isProcessing) return; // Prevent multiple simultaneous requests
    
//     try {
//       setIsProcessing(true);
//       setScanning(false);
      
//       // Stop the scanning interval immediately
//       if (scanInterval) {
//         clearInterval(scanInterval);
//         setScanInterval(null);
//       }
      
//       const scanData = {
//         doctorId: qrData.doctorId,
//         patientId: patientId,
//         timestamp: qrData.timestamp,
//         type: qrData.type || 'doctor_qr'
//       };

//       // Try the correct API endpoint
//       let response;
//       try {
//         response = await postJSON('/dev/qr/doctor-scan', scanData);
//       } catch (apiError) {
//         // If API endpoint doesn't exist, simulate success for testing
//         if (apiError.message.includes('404') || apiError.message.includes('Cannot POST')) {
//           response = { success: true, message: 'QR scan simulated (backend not implemented)' };
//         } else {
//           throw apiError;
//         }
//       }
      
//       if (response.success) {
//         setSuccess(true);
//         setTimeout(() => {
//           onScanSuccess && onScanSuccess(response);
//           onClose();
//         }, 2000);
//       } else {
//         setError('Failed to process QR code. Please try again.');
//         setIsProcessing(false);
//       }
//     } catch (error) {
//       // Check if it's a 404 error (API endpoint not found)
//       if (error.message.includes('404') || error.message.includes('Cannot POST')) {
//         setError('QR scan feature is not available yet. The backend API endpoint needs to be implemented.');
//       } else {
//         setError('Failed to scan QR code. Please try again.');
//       }
      
//       setIsProcessing(false);
//     }
//   };

//   const retryScan = () => {
//     setError(null);
//     setSuccess(false);
//     setIsProcessing(false);
//     startCamera();
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Scan Doctor QR Code</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-4">
//           {/* Camera Preview */}
//           <div className="relative bg-gray-100 rounded-lg overflow-hidden">
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               className="w-full h-64 object-cover"
//             />
//             <canvas
//               ref={canvasRef}
//               className="hidden"
//             />
            
//             {/* Scanning Overlay */}
//             {scanning && (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
//                   <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
//                   <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
//                   <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
//                   <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Status Messages */}
//           {error && (
//             <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
//               <AlertCircle className="text-red-500" size={20} />
//               <span className="text-red-700 text-sm">{error}</span>
//             </div>
//           )}

//           {success && (
//             <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//               <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xs">✓</span>
//               </div>
//               <span className="text-green-700 text-sm">QR code scanned successfully!</span>
//             </div>
//           )}

//           {/* Instructions */}
//           <div className="text-center text-gray-600 text-sm">
//             <p>Point your camera at the doctor's QR code</p>
//             <p className="text-xs text-gray-500 mt-1">
//               Make sure the QR code is clearly visible in the frame
//             </p>
//             {scanning && (
//               <p className="text-xs text-blue-600 mt-2 font-medium">
//                 Camera is active - scanning for QR codes...
//               </p>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3">
//             {!scanning && !success && (
//               <button
//                 onClick={retryScan}
//                 className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <Camera size={16} />
//                 Start Scanning
//               </button>
//             )}
            
//             {/* {scanning && !isProcessing && (
//               <button
//                 onClick={() => handleQRScan(mockQRData)}
//                 className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Camera size={16} />
//                 Test Scan (Mock)
//               </button>
//             )} */}
            
//             {isProcessing && (
//               <button
//                 disabled
//                 className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
//               >
//                 <Camera size={16} />
//                 Processing...
//               </button>
//             )}
            
//             <button
//               onClick={onClose}
//               className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default QRScanner;

import { useEffect, useRef, useState } from 'react';
import { X, Camera, AlertCircle } from 'lucide-react';
import { postJSON } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { decodeJWT } from '../utils/googleAuth';
import jsQR from 'jsqr';

// Real QR code detection using jsQR
const detectQRCode = (imageData) => {
  const code = jsQR(imageData.data, imageData.width, imageData.height);
  console.log('jsQR result:', code);
  if (code && code.data) {
    const qrContent = code.data;
    try {
      const obj = JSON.parse(qrContent);
      if (obj.doctorId) {
        return { doctorId: obj.doctorId, timestamp: new Date().toISOString(), type: 'doctor_qr' };
      }
    } catch {
      if (qrContent.startsWith('doctorId=')) {
        return { doctorId: qrContent.replace('doctorId=', ''), timestamp: new Date().toISOString(), type: 'doctor_qr' };
      }
      return { doctorId: qrContent, timestamp: new Date().toISOString(), type: 'doctor_qr' };
    }
  }
  return null;
};

function QRScanner({ onClose, onScanSuccess }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { token, user } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [scanInterval, setScanInterval] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get patient ID from authenticated user
  let patientId = null;
  if (token) {
    const decoded = decodeJWT(token);
    patientId = decoded?.id || decoded?.patient_id || user?.id;
  }

  useEffect(() => {
    if (!patientId) {
      setError('Please log in to scan QR codes');
      return;
    }

    startCamera();

    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId]);

  const startCamera = async () => {
    try {
      // Stop existing stream if any
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      console.log('Camera stream obtained:', stream);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(err => console.warn('Video play error:', err));

        setScanning(true);
        setError(null);

        const interval = setInterval(scanQRCode, 200); // Scan every 200ms
        setScanInterval(interval);
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow camera access to scan QR codes.');
    }
  };

  const stopCamera = () => {
    if (scanInterval) {
      clearInterval(scanInterval);
      setScanInterval(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current || !scanning || isProcessing) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      console.log('Video not ready yet', video.readyState);
      return;
    }

    if (!video.videoWidth || !video.videoHeight) {
      console.log('Video dimensions not available yet');
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const qrData = detectQRCode(imageData);

    if (qrData) {
      console.log('QR code detected:', qrData);
      handleQRScan(qrData);
    }
  };

  const handleQRScan = async (qrData) => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      setScanning(false);

      stopCamera();

      const scanData = {
        doctorId: qrData.doctorId,
        patientId: patientId,
        timestamp: qrData.timestamp,
        type: qrData.type || 'doctor_qr'
      };

      let response;
      try {
        response = await postJSON('/dev/qr/doctor-scan', scanData);
      } catch (apiError) {
        console.warn('API error:', apiError.message);
        if (apiError.message.includes('404') || apiError.message.includes('Cannot POST')) {
          response = { success: true, message: 'QR scan simulated (backend not implemented)' };
        } else {
          throw apiError;
        }
      }

      if (response.success) {
        console.log('QR scan success:', response);
        setSuccess(true);
        setTimeout(() => {
          onScanSuccess && onScanSuccess(response);
          onClose();
        }, 2000);
      } else {
        setError('Failed to process QR code. Please try again.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('QR scan error:', error);
      setError('Failed to scan QR code. Please try again.');
      setIsProcessing(false);
    }
  };

  const retryScan = () => {
    setError(null);
    setSuccess(false);
    setIsProcessing(false);
    startCamera();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Scan Doctor QR Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover" />
            <canvas ref={canvasRef} className="hidden" />

            {scanning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-blue-500 rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-green-700 text-sm">QR code scanned successfully!</span>
            </div>
          )}

          <div className="text-center text-gray-600 text-sm">
            <p>Point your camera at the doctor's QR code</p>
            <p className="text-xs text-gray-500 mt-1">Make sure the QR code is clearly visible in the frame</p>
            {scanning && <p className="text-xs text-blue-600 mt-2 font-medium">Camera is active - scanning for QR codes...</p>}
          </div>

          <div className="flex gap-3">
            {!scanning && !success && (
              <button
                onClick={retryScan}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Camera size={16} />
                Start Scanning
              </button>
            )}

            {isProcessing && (
              <button disabled className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed">
                <Camera size={16} />
                Processing...
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;
