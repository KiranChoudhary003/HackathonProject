import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Star, Calendar, Clock } from 'lucide-react';

function Recommendations() {
  const navigate = useNavigate();
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const hospitals = [
    {
      id: 1,
      name: 'City General Hospital',
      location: 'Downtown, 2.5 km away',
      rating: 4.5,
      specialties: 'Cardiology, Neurology, Orthopedics'
    },
    {
      id: 2,
      name: 'Medicare Clinic',
      location: 'East Side, 3.8 km away',
      rating: 4.2,
      specialties: 'General Medicine, Pediatrics'
    },
    {
      id: 3,
      name: 'HealthCare Plus',
      location: 'West End, 5.1 km away',
      rating: 4.7,
      specialties: 'Surgery, Oncology, Radiology'
    }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleConfirm = () => {
    if (selectedHospital && selectedDate && selectedTime) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Recommended Hospitals</h1>
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
                  <span className="text-sm">{hospital.location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Star size={18} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-medium text-gray-800">{hospital.rating}</span>
                  <span className="text-gray-500 text-sm">/5.0</span>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Specialties:</span> {hospital.specialties}
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
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-3 rounded-lg font-medium transition ${
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
            )}

            {selectedDate && selectedTime && (
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={handleConfirm}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  Confirm Appointment
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
