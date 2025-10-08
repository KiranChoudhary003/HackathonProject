import { useState, useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Navigation } from 'lucide-react';

// Google Maps API Key - Get from environment variables
// For demo purposes, you can temporarily replace this with a working API key
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'DEMO_KEY';

const render = (status) => {
  if (status === Status.LOADING) return <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>;
  if (status === Status.FAILURE) return (
    <div className="h-64 bg-blue-50 rounded-lg flex flex-col items-center justify-center text-blue-800 p-4 border-2 border-blue-200">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="font-bold text-lg mb-2">Google Maps Ready to Load!</p>
        <p className="text-sm mb-3">To see the interactive map, you need to:</p>
        <div className="text-left text-xs bg-white p-3 rounded border">
          <p className="font-semibold mb-2">1. Get Google Maps API Key:</p>
          <p className="mb-1">• Go to: <a href="https://console.cloud.google.com/" target="_blank" className="text-blue-600 underline">Google Cloud Console</a></p>
          <p className="mb-1">• Enable: Maps JavaScript API + Geocoding API</p>
          <p className="mb-2">• Create API Key</p>
          <p className="font-semibold mb-2">2. Add to .env file:</p>
          <p className="font-mono bg-gray-100 p-2 rounded">VITE_GOOGLE_MAPS_API_KEY=your_key_here</p>
        </div>
      </div>
    </div>
  );
  return null;
};

const MapComponent = ({ onLocationSelect, initialLocation }) => {
  const ref = useRef(null);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(initialLocation);

  useEffect(() => {
    if (ref.current && !map) {
      const mapInstance = new window.google.maps.Map(ref.current, {
        center: initialLocation || { lat: 28.6139, lng: 77.2090 }, // Default to Delhi
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });
      setMap(mapInstance);

      // Add marker
      const markerInstance = new window.google.maps.Marker({
        position: initialLocation || { lat: 28.6139, lng: 77.2090 },
        map: mapInstance,
        draggable: true,
        title: 'Your location'
      });
      setMarker(markerInstance);

      // Add click listener to map
      mapInstance.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newLocation = { lat, lng };
        
        markerInstance.setPosition(newLocation);
        setCurrentLocation(newLocation);
        onLocationSelect(newLocation);
      });

      // Add drag listener to marker
      markerInstance.addListener('dragend', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        const newLocation = { lat, lng };
        
        setCurrentLocation(newLocation);
        onLocationSelect(newLocation);
      });
    }
  }, [ref, map, onLocationSelect, initialLocation]);

  return <div ref={ref} className="w-full h-64 rounded-lg" />;
};

const LocationPicker = ({ onLocationChange, value }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(value || '');
  const [mapsAvailable, setMapsAvailable] = useState(true); // Always show map button for demo

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    
    // Reverse geocoding to get address
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const formattedAddress = results[0].formatted_address;
          setAddress(formattedAddress);
          onLocationChange(formattedAddress, location);
        }
      });
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get your current location. Please select manually on the map.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onLocationChange(e.target.value);
          }}
          placeholder={mapsAvailable ? "Enter your location or click 'Select on Map'" : "Enter your location"}
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
          required
        />
        {mapsAvailable && (
          <button
            type="button"
            onClick={toggleMap}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <MapPin size={20} />
            {showMap ? 'Hide Map' : 'Select on Map'}
          </button>
        )}
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          title="Use current location"
        >
          <Navigation size={20} />
        </button>
      </div>
      
      {showMap && mapsAvailable && (
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-2">
              Click on the map or drag the marker to select your location
            </p>
          </div>
          <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
            <MapComponent 
              onLocationSelect={handleLocationSelect} 
              initialLocation={selectedLocation}
            />
          </Wrapper>
        </div>
      )}
      
      {selectedLocation && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>Selected coordinates:</strong> {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
