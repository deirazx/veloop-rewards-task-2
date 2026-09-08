/**
 * VELOOP Rewards – Centralized API Client
 * Dynamically resolves base URL via import.meta.env.VITE_API_BASE_URL
 * In production (Netlify), connects directly to live Render backend:
 * https://veloop-giveaway-backend.onrender.com/api
 * Automatically attaches Authorization: Bearer <token>
 */

const LIVE_RENDER_BACKEND = 'https://veloop-giveaway-backend.onrender.com/api';

const resolveBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isProduction =
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1';

  if (isProduction) {
    if (!envUrl || envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
      console.info(
        '[VELOP API] Running in production. Directing requests to live Render backend: ' + LIVE_RENDER_BACKEND
      );
      return LIVE_RENDER_BACKEND;
    }
    return envUrl.trim().replace(/\/$/, '');
  }

  // Local development: use envUrl if explicitly set, else default to live Render backend
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  return LIVE_RENDER_BACKEND;
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
  let url = `${API_BASE_URL}${endpoint}`;
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
    let response;
    try {
      response = await fetch(url, config);
    } catch (fetchErr) {
      // If localhost failed (e.g. local backend isn't started), auto-fallback to live Render backend
      if (API_BASE_URL.includes('localhost') || API_BASE_URL.includes('127.0.0.1')) {
        console.warn(`[VELOP API] Local backend (${API_BASE_URL}) unreachable. Automatically routing to live Render backend: ${LIVE_RENDER_BACKEND}`);
        url = `${LIVE_RENDER_BACKEND}${endpoint}`;
        response = await fetch(url, config);
      } else {
        throw fetchErr;
      }
    }

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
      const networkErr = new Error('Backend server is unreachable. Please verify backend is running on ' + url);
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

export async function fetchAllWinners() {
  const res = await request('/winners');
  return res.data || [];
}

export async function fetchLeaderboard(filter = 'ALL_TIME') {
  const res = await request(`/leaderboard?filter=${filter}`);
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
  fetchAllWinners,
  fetchLeaderboard,
  fetchMyStatus,
  joinGiveaway,
  submitClaim,
  getDeviceHash
};

