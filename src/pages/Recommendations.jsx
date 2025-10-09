import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Star, Calendar, Clock } from 'lucide-react';
import { putJSON } from '../utils/apiClient';

function Recommendations() {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentData, setAppointmentData] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Load appointment data from session storage
  useEffect(() => {
    const storedData = sessionStorage.getItem('appointmentData');
    if (storedData) {
      const data = JSON.parse(storedData);
      setAppointmentData(data);
      setHospitals(data.hospitals || []);
    } else {
      navigate('/create');
    }
  }, [navigate]);

  // Generate time slots (9 AM to 5 PM, 30-min intervals)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // Check if a slot is taken for selected hospital and date
  const isSlotTaken = (time) => {
    if (!selectedHospital || !selectedDate) return false;
    const hospital = hospitals.find(h => h.id === selectedHospital);
    if (!hospital?.taken_slots) return false;
    
    return hospital.taken_slots.some(slot => 
      slot.slot_date === selectedDate && 
      slot.slot_time.startsWith(time)
    );
  };

  const handleConfirm = async () => {
    if (selectedHospital && selectedDate && selectedTime && appointmentData) {
      setIsBooking(true);
      try {
        const response = await putJSON(
          `/dev/appointment/${appointmentData.bookingId}`,
          {
            hospital_id: selectedHospital,
            slot_date: selectedDate,
            slot_time: `${selectedTime}:00`
          },
          { method: 'PUT' }
        );
        
        if (response.booking) {
          setBookingSuccess(true);
          sessionStorage.removeItem('appointmentData');
          
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }
      } catch (error) {
        console.error('Error booking appointment:', error);
        alert('Failed to book appointment. Please try again.');
      } finally {
        setIsBooking(false);
      }
    }
  };

  // Show booking success message
  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Booked!</h2>
          <p className="text-gray-600 mb-4">Your appointment has been successfully booked.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Available Hospitals</h1>
          <p className="text-gray-600">Select a hospital and choose your appointment time</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {hospitals.map((hospital) => (
            <div
              key={hospital.id}
              onClick={() => setSelectedHospital(hospital.id)}
              className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer p-6 ${
                selectedHospital === hospital.id ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Building2 className="text-blue-600" size={24} />
                  <h3 className="font-semibold text-lg text-gray-800">{hospital.name}</h3>
                </div>
                {selectedHospital === hospital.id && (
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm">
                    ✓
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin size={18} />
                  <span className="text-sm">{hospital.description}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {hospital.distance_km} km away
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Taken slots:</span> {hospital.taken_slots?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedHospital && (
          <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Date & Time</h2>

            <div className="mb-6">
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                <Calendar size={20} />
                Choose Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {selectedDate && (
              <div className="mb-6">
                <label className="flex items-center gap-2 text-gray-700 font-medium mb-3">
                  <Clock size={20} />
                  Choose Time Slot
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {generateTimeSlots().map((time) => {
                    const isTaken = isSlotTaken(time);
                    return (
                      <button
                        key={time}
                        onClick={() => !isTaken && setSelectedTime(time)}
                        disabled={isTaken}
                        className={`px-4 py-3 rounded-lg font-medium transition ${
                          isTaken
                            ? 'bg-red-100 text-red-500 cursor-not-allowed'
                            : selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={isTaken ? 'This slot is already booked' : ''}
                      >
                        {time}
                        {isTaken && <span className="block text-xs">Booked</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedDate && selectedTime && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleConfirm}
                  disabled={isBooking}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                >
                  {isBooking ? 'Booking Appointment...' : 'Confirm Appointment'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Recommendations;