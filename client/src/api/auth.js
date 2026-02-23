const API_URL = import.meta.env.VITE_API_URL || '/api';

let accessToken = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearAccessToken() {
  accessToken = null;
}

async function apiRequest(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function guestLogin(username) {
  const data = await apiRequest('/auth/guest', {
    method: 'POST',
    body: JSON.stringify({ username })
  });
  accessToken = data.accessToken;
  sessionStorage.setItem('guestSession', JSON.stringify({
    accessToken: data.accessToken,
    user: data.user
  }));
  return data;
}

export async function register(email, password, username) {
  const data = await apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ email, password, username })
  });
  accessToken = data.accessToken;
  return data;
}

export async function login(email, password) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  accessToken = data.accessToken;
  return data;
}

export async function refreshAccessToken() {
  try {
    const data = await apiRequest('/auth/refresh', {
      method: 'POST'
    });
    accessToken = data.accessToken;
    return data;
  } catch (err) {
    accessToken = null;
    throw err;
  }
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    accessToken = null;
    sessionStorage.removeItem('guestSession');
  }
}

export function restoreGuestSession() {
  try {
    const saved = sessionStorage.getItem('guestSession');
    if (!saved) return null;
    const session = JSON.parse(saved);
    if (session.accessToken && session.user?.isGuest) {
      accessToken = session.accessToken;
      return session;
    }
  } catch {}
  sessionStorage.removeItem('guestSession');
  return null;
}

export async function getMe() {
  return await apiRequest('/auth/me');
}
