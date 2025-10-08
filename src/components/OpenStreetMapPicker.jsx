import { useState, useRef, useEffect } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const OpenStreetMapPicker = ({ onLocationChange, value }) => {
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [address, setAddress] = useState(value || '');
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState(null);
  const mapRef = useRef(null);

  const handleLocationSelect = (lat, lng) => {
    const location = { lat, lng };
    setSelectedLocation(location);
    
    // Simple reverse geocoding using Nominatim (free)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
      .then(response => response.json())
      .then(data => {
        if (data.display_name) {
          setAddress(data.display_name);
          onLocationChange(data.display_name, location);
        }
      })
      .catch(error => {
        console.error('Error getting address:', error);
        const fallbackAddress = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setAddress(fallbackAddress);
        onLocationChange(fallbackAddress, location);
      });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          handleLocationSelect(lat, lng);
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

  const initializeMap = () => {
    if (!mapRef.current || !window.L) {
      setMapError('Map library not loaded');
      setMapLoading(false);
      return;
    }

    try {
      setMapLoading(true);
      setMapError(null);

      const map = window.L.map(mapRef.current).setView([28.6139, 77.2090], 13); // Default to Delhi
      
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      const marker = window.L.marker([28.6139, 77.2090]).addTo(map);

      // Add click listener
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        handleLocationSelect(lat, lng);
      });

      // Add marker drag listener
      marker.on('dragend', (e) => {
        const { lat, lng } = e.target.getLatLng();
        handleLocationSelect(lat, lng);
      });

      marker.dragging.enable();
      setMapLoading(false);
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to load map');
      setMapLoading(false);
    }
  };

  useEffect(() => {
    if (showMap) {
      // Load Leaflet CSS and JS
      const loadLeaflet = () => {
        // Check if already loaded
        if (window.L) {
          initializeMap();
          return;
        }

        // Check if CSS is already loaded
        if (!document.querySelector('link[href*="leaflet"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Check if JS is already loaded
        if (!document.querySelector('script[src*="leaflet"]')) {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          script.onload = () => {
            // Wait a bit for Leaflet to fully initialize
            setTimeout(() => {
              if (window.L) {
                initializeMap();
              } else {
                setMapError('Failed to load map library');
                setMapLoading(false);
              }
            }, 200);
          };
          script.onerror = () => {
            console.error('Failed to load Leaflet library');
            setMapError('Failed to load map library');
            setMapLoading(false);
          };
          document.head.appendChild(script);
        } else {
          // If script exists but window.L is not available, wait and try again
          setTimeout(() => {
            if (window.L) {
              initializeMap();
            }
          }, 500);
        }
      };

      loadLeaflet();
    }
  }, [showMap]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onLocationChange(e.target.value);
          }}
          placeholder="Enter your location or click 'Select on Map'"
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm sm:text-base"
          required
        />
        <button
          type="button"
          onClick={() => {
            if (showMap) {
              setShowMap(false);
              setMapError(null);
              setMapLoading(false);
            } else {
              setShowMap(true);
            }
          }}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <MapPin size={20} />
          {showMap ? 'Hide Map' : 'Select on Map'}
        </button>
        <button
          type="button"
          onClick={getCurrentLocation}
          className="px-3 sm:px-4 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          title="Use current location"
        >
          <Navigation size={18} className="sm:w-5 sm:h-5" />
        </button>
      </div>
      
      {showMap && (
        <div className="border border-gray-300 rounded-lg p-3 sm:p-4">
          <div className="mb-2 sm:mb-3">
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Click on the map or drag the marker to select your location
            </p>
          </div>
          <div ref={mapRef} className="w-full h-48 sm:h-64 rounded-lg bg-gray-100 relative">
            {mapLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <div className="text-gray-600">Loading map...</div>
                </div>
              </div>
            )}
            {mapError && (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
                <div className="text-center text-red-600">
                  <div className="text-2xl mb-2">⚠️</div>
                  <div className="font-medium">{mapError}</div>
                  <button
                    onClick={() => {
                      setMapError(null);
                      setMapLoading(false);
                      // Retry loading
                      setTimeout(() => {
                        if (window.L) {
                          initializeMap();
                        }
                      }, 100);
                    }}
                    className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
          </div>
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

export default OpenStreetMapPicker;
