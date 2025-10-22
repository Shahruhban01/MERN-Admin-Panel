import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
// console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  }
};

// Profile API
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (data) => {
    const response = await api.put('/profile', data);
    return response.data;
  },
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  deleteAvatar: async () => {
    const response = await api.delete('/profile/avatar');
    return response.data;
  },
  changePassword: async (data) => {
    const response = await api.put('/profile/password', data);
    return response.data;
  },
  updatePreferences: async (data) => {
    const response = await api.put('/profile/preferences', data);
    return response.data;
  }
};

// Role API
export const roleAPI = {
  getAllRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },
  getRole: async (id) => {
    const response = await api.get(`/roles/${id}`);
    return response.data;
  },
  createRole: async (data) => {
    const response = await api.post('/roles', data);
    return response.data;
  },
  updateRole: async (id, data) => {
    const response = await api.put(`/roles/${id}`, data);
    return response.data;
  },
  deleteRole: async (id) => {
    const response = await api.delete(`/roles/${id}`);
    return response.data;
  }
};

// Admin API
export const adminAPI = {
  getAllAdmins: async () => {
    const response = await api.get('/admins');
    return response.data;
  },
  getAdmin: async (id) => {
    const response = await api.get(`/admins/${id}`);
    return response.data;
  },
  createAdmin: async (data) => {
    const response = await api.post('/admins', data);
    return response.data;
  },
  updateAdmin: async (id, data) => {
    const response = await api.put(`/admins/${id}`, data);
    return response.data;
  },
  deleteAdmin: async (id) => {
    const response = await api.delete(`/admins/${id}`);
    return response.data;
  }
};

export default api;
