import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Building2, QrCode, Scan } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRScanner from '../components/QRScanner';
import { useAuth } from '../context/AuthContext';
import { decodeJWT } from '../utils/googleAuth';

function Dashboard() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated, loading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  // Get patient ID from JWT token or user object
  let patientId = null;
  if (token) {
    const decoded = decodeJWT(token);
    patientId = decoded?.id || decoded?.patient_id || user?.id;
  }

  // Fetch appointments from backend
  useEffect(() => {
    async function fetchAppointments() {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }
      
      if (!isAuthenticated || !patientId) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      const url = `/dev/appointment?patient_id=${patientId}`;
      
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        };
        
        const res = await fetch(url, { 
          method: 'GET',
          headers,
          credentials: 'include'
        });
        
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
        
        const data = await res.json();
        
        // Check if bookings exist and is an array
        if (data.bookings && Array.isArray(data.bookings)) {
          setAppointments(data.bookings);
        } else {
          setAppointments([]);
        }
      } catch (e) {
        console.error('Error fetching appointments:', e);
        setAppointments([]);
      }
      setLoading(false);
    }
    fetchAppointments();
  }, [patientId, token, isAuthenticated, authLoading]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Show loading while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your appointments</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-gray-600">View your healthcare appointments</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                  </div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <Building2 size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="text-lg">No appointments found</p>
            <p className="text-sm">Book your first appointment to get started</p>
                </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => {
              
              // Get status color and text
              const getStatusInfo = (status) => {
                switch (status?.toLowerCase()) {
                  case 'booked':
                    return { color: 'bg-blue-100 text-blue-700', text: 'Booked' };
                  case 'confirmed':
                    return { color: 'bg-green-100 text-green-700', text: 'Confirmed' };
                  case 'arrived':
                    return { color: 'bg-yellow-100 text-yellow-700', text: 'Arrived' };
                  case 'completed':
                    return { color: 'bg-gray-100 text-gray-700', text: 'Completed' };
                  case 'cancelled':
                    return { color: 'bg-red-100 text-red-700', text: 'Cancelled' };
                  default:
                    return { color: 'bg-gray-100 text-gray-700', text: status || 'Unknown' };
                }
              };
              
              const statusInfo = getStatusInfo(appointment.status);
              
              return (
                <div key={appointment.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <Building2 className="text-blue-600" size={32} />
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-gray-800 mb-2">
                          {appointment.hospital_name || `Hospital #${appointment.hospital_id || 'N/A'}`}
                        </h3>
                        <div className="flex items-center gap-6 text-gray-600">
                          <div className="flex items-center gap-2">
                  <Calendar size={18} />
                            <span className="font-medium">{appointment.slot_date || '—'}</span>
                </div>
                          <div className="flex items-center gap-2">
                  <Clock size={18} />
                            <span className="font-medium">{appointment.slot_time || '—'}</span>
                          </div>
                        </div>
                      </div>
                </div>

                    {/* Status Badge */}
                    <div className="flex items-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
                        {statusInfo.text}
                  </span>
                    </div>
                </div>

                  {/* Additional appointment details if available */}
                  {appointment.symptoms && (
                    <div className="pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        <div className="mb-2">
                          <span className="font-medium">Symptoms:</span> {appointment.symptoms}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
              </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Book New Appointment
          </button>
          
          {/* <button
            onClick={() => setShowQRGenerator(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <QrCode size={20} />
            My QR Code
          </button> */}
          
          <button
            onClick={() => setShowQRScanner(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            <Scan size={20} />
            Scan QR Code
          </button>
        </div>
      </div>

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator
          userId={patientId || 'user_12345'}
          onClose={() => setShowQRGenerator(false)}
        />
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={(result) => {
            alert('QR code scanned successfully! Doctor has been notified.');
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;
