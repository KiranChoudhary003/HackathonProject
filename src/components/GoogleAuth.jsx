import { useEffect, useRef, useState } from 'react';
import { postJSON } from '../utils/apiClient';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogleCode } from '../utils/googleAuth';

function GoogleAuth({ size = 'large', text = 'signin_with', onAfterLogin }) {
  const btnRef = useRef(null);
  const { login } = useAuth();
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(null);
  const clientId = import.meta?.env?.VITE_GOOGLE_CLIENT_ID || "66449176523-brfmp9k38luah1vp9r6fns50831l2ke9.apps.googleusercontent.com";

  useEffect(() => {
    setError(null);
    if (!clientId) {
      console.error('VITE_GOOGLE_CLIENT_ID is not set');
      return;
    }
    const init = () => {
      if (!window.google?.accounts?.oauth2) return;
      // We've loaded the OAuth2 code flow API, show our custom button
      setReady(true);
    };

    if (window.google?.accounts?.id) {
      init();
    } else {
      const existing = document.getElementById('google-gsi-script');
      if (!existing) {
        const script = document.createElement('script');
        script.id = 'google-gsi-script';
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => init();
        script.onerror = () => setError('Failed to load Google services.');
        document.head.appendChild(script);
      }
      const t = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          clearInterval(t);
          init();
        }
      }, 300);
      const timeout = setTimeout(() => setError('Taking longer than expected. Check blockers or network.'), 5000);
      return () => { clearInterval(t); clearTimeout(timeout); };
    }
  }, [clientId, login, onAfterLogin, size, text]);

  return (
    <div className="inline-flex">
      {!clientId && (
        <button
          type="button"
          disabled
          title="Set VITE_GOOGLE_CLIENT_ID in .env and restart"
          className="px-4 py-2 rounded bg-gray-300 text-gray-700 cursor-not-allowed"
        >
          Google Sign-In (configure .env)
        </button>
      )}
      {clientId && !ready && !error && (
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded bg-gray-200 text-gray-600 cursor-wait"
        >
          Loading Google...
        </button>
      )}
      {error && (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded bg-red-100 text-red-700"
          title={error}
        >
          Retry Google Sign-In
        </button>
      )}
      {ready && !error && clientId && (
        <button
          type="button"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={async () => {
            try {
              const code = await signInWithGoogleCode();
              const apiRes = await postJSON('/dev/auth/patient', { code });
              login({ token: apiRes?.token || code, user: apiRes?.user || null });
              onAfterLogin?.(apiRes);
            } catch (e) {
              console.error(e);
              alert('Google Sign-In failed');
            }
          }}
        >
          Continue with Google
        </button>
      )}
    </div>
  );
}

export default GoogleAuth;


