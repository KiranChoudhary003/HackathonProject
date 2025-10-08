import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, Shield, MapPin, Camera, LogIn } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)]">
          <div>
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-900">HealthCare</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Your Health,
              <br />
              <span className="text-blue-600">Our Priority</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8">
              Access your healthcare appointment dashboard. Simple, fast, and secure.
            </p>

            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-50 p-2 rounded-lg mt-1">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Easy Scheduling</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Book appointments in just a few clicks</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-50 p-2 rounded-lg mt-1">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Real-time Availability</h3>
                  <p className="text-gray-600 text-sm sm:text-base">See available slots instantly</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-orange-50 p-2 rounded-lg mt-1">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Secure & Private</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Your health data is protected</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-50 p-2 rounded-lg mt-1">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Location Services</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Find nearby healthcare providers</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-red-50 p-2 rounded-lg mt-1">
                  <Camera className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Photo Upload</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Upload medical documents easily</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center justify-center space-x-3 w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg group text-sm sm:text-base"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Login to Dashboard</span>
            </button>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-3xl opacity-20 blur-3xl"></div>
              <img
                src="https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Healthcare professional"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
