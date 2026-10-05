const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_KEY = 'mindsense_token';

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function authHeaders(headers = {}) {
  const token = getAuthToken();
  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
}

async function parseResponse(response, fallback) {
  const data = await response.json().catch(() => fallback);

  if (!response.ok) {
    throw new Error(data.detail || 'Request failed');
  }

  return data;
}

export async function loginWithPassword({ email, password }) {
  const body = new URLSearchParams();
  body.set('username', email);
  body.set('password', password);

  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const tokenData = await parseResponse(response, {});
  setAuthToken(tokenData.access_token);
  const user = await fetchCurrentUser();

  return { ...tokenData, user };
}

export async function fetchCurrentUser() {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: authHeaders(),
  });

  return parseResponse(response, {});
}

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

  setAuthToken(data.access_token);
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
  const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
    headers: authHeaders(),
  });
  const data = await response.json().catch(() => []);

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load users');
  }

  return data;
}

export async function fetchDatabaseStatus() {
  const response = await fetch(`${API_BASE_URL}/api/admin/database-status`, {
    headers: authHeaders(),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to check database connection');
  }

  return data;
}

async function postJson(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
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

export function createAssessment(payload) {
  return postJson('/api/assessments', payload);
}

export async function fetchMyAssessments() {
  const response = await fetch(`${API_BASE_URL}/api/assessments/me`, {
    headers: authHeaders(),
  });

  return parseResponse(response, []);
}

export async function fetchAssessment(assessmentId) {
  const response = await fetch(`${API_BASE_URL}/api/assessments/${assessmentId}`, {
    headers: authHeaders(),
  });

  return parseResponse(response, {});
}
