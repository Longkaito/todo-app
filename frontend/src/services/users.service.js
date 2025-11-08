import api from '../config/api';

export const usersService = {
  getAll: async (params) => {
    const response = await api.get('/users', { params });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  },

  create: async (data) => {
    const response = await api.post('/users', data);
    return response.data.data.user;
  },

  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data.user;
  },

  delete: async (id) => {
    await api.delete(`/users/${id}`);
  },
};

