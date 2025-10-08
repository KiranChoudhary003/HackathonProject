# Google Maps Integration Setup

This application includes Google Maps integration for location selection. To enable this feature, you need to set up a Google Maps API key.

## Steps to Set Up Google Maps API Key

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Geocoding API**
   - **Places API** (optional, for better address suggestions)

### 2. Create API Credentials

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key

### 3. Configure the Application

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add your API key:

```
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 4. Restart the Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## Features

Once configured, the location picker will provide:

- **Interactive Map**: Click anywhere on the map to select a location
- **Draggable Marker**: Drag the marker to fine-tune your selection
- **Current Location**: Use GPS to automatically detect your current location
- **Address Conversion**: Automatically converts coordinates to readable addresses
- **Manual Input**: Still allows typing addresses manually

## Security Notes

- Never commit your actual API key to version control
- Add `.env` to your `.gitignore` file
- Consider restricting your API key to specific domains in production
- Monitor your API usage to avoid unexpected charges

## Fallback Behavior

If no API key is provided or if Google Maps fails to load, the application will:
- Show only the text input field
- Hide the map selection buttons
- Display a helpful message about setting up the API key
- Still allow manual location entry
