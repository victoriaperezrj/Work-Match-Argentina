import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth functions
export const auth = {
  register: async (email: string, password: string, role: string) => {
    const response = await api.post('/api/v1/auth/register', { email, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/api/v1/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};

// Profile functions
export const profile = {
  getMe: async () => {
    const response = await api.get('/api/v1/profile/me');
    return response.data;
  },

  updateProviderProfile: async (data: {
    services: string[];
    radius_km: number;
    lat: number;
    lon: number;
  }) => {
    const response = await api.put('/api/v1/profile/provider', data);
    return response.data;
  },
};

// Request functions
export const requests = {
  create: async (data: {
    description: string;
    service_type: string;
    lat: number;
    lon: number;
  }) => {
    const response = await api.post('/api/v1/requests/create', data);
    return response.data;
  },

  getPending: async () => {
    const response = await api.get('/api/v1/requests/pending');
    return response.data;
  },

  getMyRequests: async () => {
    const response = await api.get('/api/v1/requests/my-requests');
    return response.data;
  },

  accept: async (requestId: number) => {
    const response = await api.post(`/api/v1/requests/${requestId}/accept`);
    return response.data;
  },

  complete: async (requestId: number) => {
    const response = await api.post(`/api/v1/requests/${requestId}/complete`);
    return response.data;
  },
};

export const SERVICE_TYPES = [
  'Plomeria',
  'Electricidad',
  'Jardineria',
  'Limpieza',
  'Pintura',
  'Carpinteria',
  'Herreria',
  'Albañileria',
  'Techado',
  'Mudanza',
];
