import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Building2, Plus, X, QrCode } from 'lucide-react';
import QRCodeGenerator from '../components/QRCodeGenerator';

function Dashboard() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      hospital: 'City General Hospital',
      doctor: 'Dr. Sarah Johnson',
      specialization: 'General Medicine',
      date: '2025-10-15',
      time: '10:00 AM',
      status: 'Pending'
    },
    {
      id: 2,
      hospital: 'Medicare Clinic',
      doctor: 'Dr. Michael Chen',
      specialization: 'Cardiology',
      date: '2025-10-08',
      time: '2:30 PM',
      status: 'Visited'
    },
    {
      id: 3,
      hospital: 'HealthCare Plus',
      doctor: 'Dr. Emily Rodriguez',
      specialization: 'Dermatology',
      date: '2025-10-20',
      time: '11:15 AM',
      status: 'Pending'
    }
  ]);
  
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showQRGenerator, setShowQRGenerator] = useState(false);
  
  // For demo purposes, using a static user ID
  const currentUserId = 'user_12345';

  // Available time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const handleBookAgain = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDateModal(true);
    setSelectedDate('');
    setSelectedTime('');
  };

  const handleScheduleAppointment = () => {
    if (selectedDate && selectedTime && selectedAppointment) {
      const newAppointment = {
        id: appointments.length + 1,
        hospital: selectedAppointment.hospital,
        doctor: selectedAppointment.doctor,
        specialization: selectedAppointment.specialization,
        date: selectedDate,
        time: selectedTime,
        status: 'Pending'
      };

      setAppointments([...appointments, newAppointment]);
      setShowDateModal(false);
      setSelectedAppointment(null);
      setSelectedDate('');
      setSelectedTime('');
      
      // Show success message (you can replace this with a toast notification)
      alert('Appointment scheduled successfully!');
    }
  };

  const closeModal = () => {
    setShowDateModal(false);
    setSelectedAppointment(null);
    setSelectedDate('');
    setSelectedTime('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2">My Appointments</h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage your healthcare appointments</p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 sm:p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-600" size={24} />
                  <div>
                    <h3 className="font-semibold text-base sm:text-lg text-gray-800">
                      {appointment.hospital}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{appointment.doctor}</p>
                    <p className="text-xs text-blue-600">{appointment.specialization}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={18} />
                  <span className="text-sm sm:text-base">{appointment.date}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <span className="text-sm sm:text-base">{appointment.time}</span>
                </div>

                <div className="pt-2">
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      appointment.status === 'Visited'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>

                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleBookAgain(appointment)}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors"
                  >
                    <Plus size={14} className="sm:w-4 sm:h-4" />
                    Book Again
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <button
            onClick={() => navigate('/create')}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            Book Another Appointment
          </button>
          
          <button
            onClick={() => setShowQRGenerator(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base lg:text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
          >
            <QrCode size={16} className="sm:w-5 sm:h-5" />
            My QR Code
          </button>
        </div>
      </div>

      {/* Date Selection Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Schedule New Appointment</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {selectedAppointment && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-800">{selectedAppointment.hospital}</h3>
                <p className="text-gray-600">{selectedAppointment.doctor}</p>
                <p className="text-sm text-blue-600">{selectedAppointment.specialization}</p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleAppointment}
                  disabled={!selectedDate || !selectedTime}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Generator Modal */}
      {showQRGenerator && (
        <QRCodeGenerator
          userId={currentUserId}
          onClose={() => setShowQRGenerator(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
