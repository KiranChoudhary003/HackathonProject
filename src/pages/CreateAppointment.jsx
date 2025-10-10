import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, FileText, Upload, Plus, X, Camera } from 'lucide-react';
import OpenStreetMapPicker from '../components/OpenStreetMapPicker';
import CameraCapture from '../components/CameraCapture';
import { postJSON } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { decodeJWT } from '../utils/googleAuth';

function CreateAppointment() {
  const navigate = useNavigate();
  const { token, user, isAuthenticated } = useAuth();
  const [symptoms, setSymptoms] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    coordinates: null,
    file: null
  });
  const [showCamera, setShowCamera] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // Get patient ID from authenticated user
  let patientId = null;
  if (token) {
    const decoded = decodeJWT(token);
    patientId = decoded?.id || decoded?.patient_id || user?.id;
  }

  const addSymptom = () => {
    setSymptoms([...symptoms, '']);
  };

  const removeSymptom = (index) => {
    if (symptoms.length > 1) {
      setSymptoms(symptoms.filter((_, i) => i !== index));
    }
  };

  const updateSymptom = (index, value) => {
    const newSymptoms = [...symptoms];
    newSymptoms[index] = value;
    setSymptoms(newSymptoms);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleLocationChange = (address, coordinates) => {
    setFormData({
      ...formData,
      location: address,
      coordinates: coordinates
    });
  };

  const handleCameraCapture = (file) => {
    setFormData({ ...formData, file });
    setShowCamera(false);
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data?.display_name || null;
    } catch {
      return null;
    }
  };

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const address = await reverseGeocode(coords.lat, coords.lng);
        setFormData({
          ...formData,
          location: address || `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
          coordinates: coords
        });
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        alert('Unable to fetch your location. Please allow location access or try again.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('images', file);
    const res = await fetch('/dev/uploadImage', {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Upload failed');
    const data = await res.json();
    return data.files[0]?.path || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is authenticated
    if (!isAuthenticated || !patientId) {
      alert('Please log in to create an appointment');
      navigate('/');
      return;
    }
    
    if (!formData.coordinates) {
      alert('Please select your location');
      return;
    }
    
    try {
      let filePath = null;
      if (formData.file) {
        filePath = await uploadFile(formData.file);
      }
      
      const appointmentData = {
        patient_id: patientId, // Use real patient ID from authenticated user
        latitude: formData.coordinates.lat,
        longitude: formData.coordinates.lng,
        symptoms: symptoms.filter(s => s.trim()),
        file_paths: filePath ? [filePath] : []
      };
      
      const response = await postJSON('/dev/appointment', appointmentData);
      
      sessionStorage.setItem('appointmentData', JSON.stringify({
        ...formData,
        symptoms: symptoms.filter(s => s.trim()),
        bookingId: response.booking_id,
        hospitals: response.hospitals
      }));
      navigate('/recommendations');
    } catch (error) {
      alert('Failed to create appointment. Please try again.');
    }
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to book an appointment</p>
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
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book New Appointment</h1>
          <p className="text-gray-600 mb-8">Fill in your details to book an appointment</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <User size={20} />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              />
            </div> */}


            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <MapPin size={20} />
                Location
              </label>
              <div className="space-y-3">
                <div className="flex gap-2">
                  {/* <button
                    type="button"
                    onClick={useCurrentLocation}
                    className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                    disabled={isLocating}
                    title="Use my current location"
                  >
                    {isLocating ? 'Detecting…' : 'Use Current Location'}
                  </button> */}
                  {/* <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Enter your location"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required */}
                  {/* /> */}
                </div>
                <OpenStreetMapPicker
                  onLocationChange={handleLocationChange}
                  value={formData.location}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <FileText size={20} />
                Symptoms
              </label>
              <div className="space-y-3">
                {symptoms.map((symptom, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={symptom}
                      onChange={(e) => updateSymptom(index, e.target.value)}
                      placeholder={`Symptom ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      required
                    />
                    {symptoms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSymptom(index)}
                        className="px-3 py-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addSymptom}
                className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
              >
                <Plus size={20} />
                Add more symptoms
              </button>
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                <Upload size={20} />
                Upload Medical Documents
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-gray-600">
                      {formData.file ? formData.file.name : 'Click to upload images or PDFs'}
                    </span>
                    <span className="text-sm text-gray-500">Supports: JPG, PNG, PDF</span>
                  </label>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCamera(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Camera size={20} />
                    Take Photo
                  </button>
                  <label
                    htmlFor="file-upload"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Upload size={20} />
                    Choose File
                  </label>
                </div>
                {formData.file && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-700 font-medium">File selected:</span>
                      <span className="text-green-600">{formData.file.name}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}

export default CreateAppointment;
