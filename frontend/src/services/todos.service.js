import api from '../config/api';

export const todosService = {
  getAll: async (params) => {
    const response = await api.get('/todos', { params });
    return response.data.data;
  },

  getById: async (id) => {
    const response = await api.get(`/todos/${id}`);
    return response.data.data.todo;
  },

  create: async (data) => {
    const response = await api.post('/todos', data);
    return response.data.data.todo;
  },

  update: async (id, data) => {
    const response = await api.put(`/todos/${id}`, data);
    return response.data.data.todo;
  },

  delete: async (id) => {
    await api.delete(`/todos/${id}`);
  },
};

