import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, CreditCard, MapPin, FileText, Upload, Plus, X, Camera } from 'lucide-react';
import OpenStreetMapPicker from '../components/OpenStreetMapPicker';
import CameraCapture from '../components/CameraCapture';

function CreateAppointment() {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState(['']);
  const [formData, setFormData] = useState({
    name: '',
    aadhar: '',
    location: '',
    coordinates: null,
    file: null
  });
  const [showCamera, setShowCamera] = useState(false);

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
    setFormData({ ...formData, file: file });
    setShowCamera(false);
  };

  const openCamera = () => {
    setShowCamera(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/recommendations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-4 sm:py-6 lg:py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Book New Appointment</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Fill in your details to book an appointment</p>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                <User size={18} className="sm:w-5 sm:h-5" />
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                <CreditCard size={18} className="sm:w-5 sm:h-5" />
                Aadhar Number
              </label>
              <input
                type="text"
                value={formData.aadhar}
                onChange={(e) => setFormData({ ...formData, aadhar: e.target.value })}
                placeholder="Enter 12-digit Aadhar number"
                maxLength="12"
                pattern="[0-9]{12}"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-gray-700 font-medium mb-2 text-sm sm:text-base">
                <MapPin size={18} className="sm:w-5 sm:h-5" />
                Location
              </label>
              <OpenStreetMapPicker 
                onLocationChange={handleLocationChange}
                value={formData.location}
              />
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
                    onClick={openCamera}
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
                    {formData.file.type.startsWith('image/') && (
                      <div className="mt-2">
                        <img
                          src={URL.createObjectURL(formData.file)}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    )}
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

      {/* Camera Capture Modal */}
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
