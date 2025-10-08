// Mock API functions for QR scanning
// In a real application, these would make actual HTTP requests to your backend

export const mockScanUser = async (scanData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response
  return {
    success: true,
    message: 'QR code scanned successfully',
    data: {
      scannerUserId: scanData.scannerUserId,
      scannedUserId: scanData.scannedUserId,
      timestamp: scanData.timestamp,
      scanId: `scan_${Date.now()}`
    }
  };
};

// Mock function to simulate backend API call
export const scanUserAPI = async (scanData) => {
  try {
    // In a real app, this would be:
    // const response = await fetch('/api/scan-user', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(scanData)
    // });
    
    // For now, using mock data
    return await mockScanUser(scanData);
  } catch (error) {
    throw new Error('Failed to process scan');
  }
};
