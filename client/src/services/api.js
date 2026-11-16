// Data layer (client): all HTTP calls to the Ember API live here.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const TOKEN_KEY = 'ember_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Please try again.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Something went wrong');
  }
  return data;
}

export const authApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: () => request('/auth/me'),
};

export const sessionsApi = {
  list: () => request('/sessions'),
  create: (payload) => request('/sessions', { method: 'POST', body: payload }),
};

export const checkInsApi = {
  list: () => request('/checkins'),
  save: (payload) => request('/checkins', { method: 'POST', body: payload }),
};

export const loadApi = {
  weekly: ({ today, tzOffset }) => {
    const params = new URLSearchParams({ today, tzOffset });
    return request(`/load/weekly?${params.toString()}`);
  },
};
