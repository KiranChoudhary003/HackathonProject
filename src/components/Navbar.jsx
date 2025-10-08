import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Plus, Heart, QrCode } from 'lucide-react';
import QRScanner from './QRScanner';
import Notification from './Notification';

function Navbar() {
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // For demo purposes, using a static user ID
  // In a real app, this would come from authentication context
  const currentUserId = 'user_12345';

  const handleQRScan = (scanData) => {
    console.log('QR Scan completed:', scanData);
    
    // Show success notification
    setNotification({
      message: `Successfully scanned user: ${scanData.scannedUserId}`,
      type: 'success',
      duration: 4000
    });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-1 sm:gap-2">
            <Heart className="text-blue-600" size={24} className="sm:w-7 sm:h-7" />
            <span className="font-bold text-lg sm:text-xl text-gray-800">HealthCare</span>
          </div>

          <div className="flex gap-0.5 sm:gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Home size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">Home</span>
            </NavLink>

            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <LayoutDashboard size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">Dashboard</span>
            </NavLink>

            <NavLink
              to="/create"
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Plus size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">Book Appointment</span>
            </NavLink>

            <NavLink
              to="/recommendations"
              className={({ isActive }) =>
                `flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Heart size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">Hospitals</span>
            </NavLink>

            <button
              onClick={() => setShowQRScanner(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition text-gray-700 hover:bg-gray-100"
            >
              <QrCode size={16} className="sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base hidden sm:inline">Scan QR</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
          currentUserId={currentUserId}
        />
      )}

      {/* Notification */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          duration={notification.duration}
          onClose={closeNotification}
        />
      )}
    </nav>
  );
}

export default Navbar;
