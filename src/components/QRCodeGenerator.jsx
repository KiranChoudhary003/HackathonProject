import { useState } from 'react';
import { QrCode, Download, Copy } from 'lucide-react';

const QRCodeGenerator = ({ userId, onClose }) => {
  const [copied, setCopied] = useState(false);

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${userId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `qr-code-${userId}.png`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <QrCode className="w-8 h-8 text-blue-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Your QR Code</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="mx-auto rounded-lg"
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <p className="text-blue-800 font-medium">User ID</p>
            <p className="text-blue-600 text-sm font-mono">{userId}</p>
          </div>
          
          <div className="flex gap-3 mb-4">
            <button
              onClick={copyToClipboard}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy ID'}
            </button>
            <button
              onClick={downloadQR}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
          
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;

