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

export async function fetchAdminUsers() {
  const response = await fetch(`${API_BASE_URL}/api/admin/users`);
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load users');
  }

  return data;
}

export async function fetchDatabaseStatus() {
  const response = await fetch(`${API_BASE_URL}/api/admin/database-status`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to check database connection');
  }

  return data;
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }

  return data;
}

export async function fetchMentalOptions() {
  const response = await fetch(`${API_BASE_URL}/api/ml/mental-risk/options`);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load assessment options');
  }

  return data;
}

export function predictMentalRisk(payload) {
  return postJson('/api/ml/mental-risk', payload);
}

export function predictFacialEmotion(image) {
  return postJson('/api/ml/facial-emotion', { image });
}

export function buildFinalAssessment(payload) {
  return postJson('/api/ml/final-assessment', payload);
}
