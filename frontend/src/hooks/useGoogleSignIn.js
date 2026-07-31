import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogleToken } from '../lib/api';
import { decodeGoogleCredential, saveUserProfile } from '../lib/userProfile';

const GOOGLE_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

function loadGoogleScript() {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    if (window.google?.accounts?.id) {
      resolve();
      return;
    }

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true });
      existingScript.addEventListener('error', reject, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export function useGoogleSignIn() {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    let cancelled = false;

    async function initializeGoogleSignIn() {
      if (!googleClientId || !buttonRef.current) {
        return;
      }

      try {
        await loadGoogleScript();

        if (cancelled) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            setError('');
            setLoading(true);

            try {
              const data = await loginWithGoogleToken(response.credential);
              const profile = data.user || decodeGoogleCredential(response.credential);
              if (profile) {
                saveUserProfile({
                  name: profile.name,
                  email: profile.email,
                  picture: profile.profile_picture || profile.picture,
                });
              }
              navigate('/dashboard');
            } catch (err) {
              setError(err.message || 'Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
        });

        buttonRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          width: buttonRef.current.offsetWidth || 320,
          text: 'continue_with',
          shape: 'rectangular',
        });
      } catch {
        if (!cancelled) {
          setError('Google sign-in could not be loaded');
        }
      }
    }

    initializeGoogleSignIn();

    return () => {
      cancelled = true;
    };
  }, [googleClientId, navigate]);

  return {
    buttonRef,
    error,
    loading,
    isConfigured: Boolean(googleClientId),
  };
}
