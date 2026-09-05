/**
 * VELOOP Rewards – Centralized API Client
 * Dynamically resolves base URL via import.meta.env.VITE_API_BASE_URL
 * In production (Netlify), connects directly to live Render backend:
 * https://veloop-giveaway-backend.onrender.com/api
 * Automatically attaches Authorization: Bearer <token>
 */

const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isProduction =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      console.info(
        '[VELOP API] Running in production. Directing requests to live Render backend: https://veloop-giveaway-backend.onrender.com/api'
      );
      return 'https://veloop-giveaway-backend.onrender.com/api';
    }
    return envUrl.trim().replace(/\/$/, '');
  }

  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = resolveBaseUrl();

// Persistent hardware device fingerprint simulation
export const getDeviceHash = () => {
  let hash = localStorage.getItem('veloop_device_hash');
  if (!hash) {
    hash = 'dev_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('veloop_device_hash', hash);
  }
  return hash;
};

// Generic request wrapper
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('veloop_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error = new Error(data.message || data.error || `Request failed with status ${response.status}`);
      error.status = response.status;
      error.code = data.code || data.error;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const networkErr = new Error('Backend server is unreachable. Please verify backend is running on ' + API_BASE_URL);
      networkErr.isNetworkError = true;
      throw networkErr;
    }
    throw err;
  }
}

// ---------------- AUTHENTICATION APIS ----------------
export async function register(name, email, password, phone = '') {
  return await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, phone })
  });
}

export async function login(email, password) {
  return await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export async function fetchMe() {
  return await request('/auth/me');
}

// ---------------- GIVEAWAY & PARTICIPATION APIS ----------------
export async function fetchCurrentGiveaway() {
  const res = await request('/giveaways/current');
  return res.data || [];
}

export async function fetchWinners(giveawayId) {
  return await request(`/giveaways/${giveawayId}/winners`);
}

export async function fetchPreviousWinners() {
  const res = await request('/giveaways/previous/winners');
  return res.data || [];
}

export async function fetchMyStatus(giveawayId) {
  const res = await request(`/participation/${giveawayId}/my-status`);
  return res.data || { hasJoined: false };
}

export async function joinGiveaway(giveawayId, prizeId, deviceHash) {
  const body = {
    giveawayId,
    prizeId: prizeId || 'default',
    deviceHash: deviceHash || getDeviceHash()
  };

  return await request('/participation/join', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

export async function submitClaim(giveawayId, payload) {
  return await request(`/claim/${giveawayId}/claim`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export default {
  API_BASE_URL,
  register,
  login,
  fetchMe,
  fetchCurrentGiveaway,
  fetchWinners,
  fetchPreviousWinners,
  fetchMyStatus,
  joinGiveaway,
  submitClaim,
  getDeviceHash
};
