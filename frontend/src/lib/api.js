const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function loginWithGoogleToken(credential) {
  const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: credential }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Google sign-in failed');
  }

  localStorage.setItem('mindsense_token', data.access_token);
  return data;
}

export async function registerUser({ name, email, password }) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed');
  }

  return data;
}
