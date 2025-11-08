import api from '../config/api';

export const authService = {
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data.data;
  },

  register: async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  },

  logout: async (refreshToken) => {
    await api.post('/auth/logout', { refreshToken });
  },

  logoutAll: async () => {
    await api.post('/auth/logout-all');
  },
};

