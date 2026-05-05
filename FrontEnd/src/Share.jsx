import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const Share = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateShareContent();
  }, []);

  const generateShareContent = async () => {
    // Get the current URL - in production, this would be your deployed app URL
    const baseUrl = window.location.origin;
    const appUrl = baseUrl;
    
    setShareUrl(appUrl);

    try {
      // Generate QR Code
      const qrDataUrl = await QRCode.toDataURL(appUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Study Planner - AI-Powered Learning',
          text: 'Check out this amazing AI-powered study planner that generates personalized schedules and quizzes!',
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-600 text-lg">
        Generating share content...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <header className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">📤 Share Smart Study Planner</h1>
            <p className="text-lg md:text-xl opacity-90">Invite others to join the AI-powered learning experience</p>
          </header>

          <div className="p-6 md:p-8">
            {/* QR Code Section */}
            <div className="bg-gray-50 p-8 rounded-2xl mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Scan QR Code</h2>
              <div className="flex justify-center mb-6">
                {qrCodeUrl ? (
                  <img 
                    src={qrCodeUrl} 
                    alt="Smart Study Planner QR Code" 
                    className="border-4 border-white rounded-xl shadow-lg"
                  />
                ) : (
                  <div className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">QR Code Loading...</p>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                Scan this QR code with your mobile device to access the app
              </p>
            </div>

            {/* URL Sharing Section */}
            <div className="bg-gray-50 p-8 rounded-2xl mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Share URL</h2>
              <div className="flex space-x-4 mb-6">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg bg-white"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-600 transition-colors"
                >
                  {copied ? '✓ Copied!' : '📋 Copy URL'}
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={shareViaWebShare}
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                >
                  📤 Share App
                </button>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">What They'll Get</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border-l-4 border-indigo-500">
                  <div className="text-2xl mb-3">📚</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Generated Schedules</h3>
                  <p className="text-gray-600 text-sm">Personalized study plans based on subjects, topics, and learning preferences</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-purple-500">
                  <div className="text-2xl mb-3">🧠</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Smart Quiz Generation</h3>
                  <p className="text-gray-600 text-sm">Custom quizzes with instant feedback and detailed explanations</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-pink-500">
                  <div className="text-2xl mb-3">📈</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600 text-sm">Complete history of schedules and quizzes with performance analytics</p>
                </div>
                <div className="bg-white p-6 rounded-xl border-l-4 border-green-500">
                  <div className="text-2xl mb-3">🔐</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Secure Accounts</h3>
                  <p className="text-gray-600 text-sm">User authentication with secure password management</p>
                </div>
              </div>
            </div>

            {/* Capacity Information */}
            <div className="mt-8 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🌐 Live Project Information</h3>
              <div className="text-blue-700 space-y-2">
                <p><strong>Current Capacity:</strong> Unlimited users</p>
                <p><strong>Technology:</strong> Scalable Node.js backend with React frontend</p>
                <p><strong>Database:</strong> SQLite for development, easily upgradeable to PostgreSQL for production</p>
                <p><strong>AI Features:</strong> Google Gemini API with generous rate limits</p>
                <p><strong>Deployment:</strong> Ready for Vercel, Netlify, or any cloud platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
