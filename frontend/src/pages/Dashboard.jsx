import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { todosService } from '../services/todos.service';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    completed: false,
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadTodos();
  }, [filter]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const params = { page: 1, limit: 100 };
      if (filter === 'completed') params.completed = true;
      if (filter === 'pending') params.completed = false;

      const response = await todosService.getAll(params);
      setTodos(response.todos);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể tải danh sách todos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingTodo(null);
    setFormData({ title: '', description: '', completed: false });
    setShowModal(true);
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setFormData({
      title: todo.title,
      description: todo.description || '',
      completed: todo.completed,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa todo này?')) return;

    try {
      await todosService.delete(id);
      loadTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể xóa todo');
    }
  };

  const handleToggleComplete = async (todo) => {
    try {
      await todosService.update(todo.id, { completed: !todo.completed });
      loadTodos();
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể cập nhật todo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTodo) {
        await todosService.update(editingTodo.id, formData);
      } else {
        await todosService.create(formData);
      }
      setShowModal(false);
      loadTodos();
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Có lỗi xảy ra';
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        setError(errors.map((e) => e.message).join(', '));
      } else {
        setError(errorMessage);
      }
    }
  };

  const filteredTodos =
    filter === 'all'
      ? todos
      : filter === 'completed'
      ? todos.filter((t) => t.completed)
      : todos.filter((t) => !t.completed);

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Todo</h2>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm Todo
            </button>
          </div>

          {/* Filter */}
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'pending'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Chưa hoàn thành
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Đã hoàn thành
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Không có todo nào
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-white rounded-lg shadow p-4 ${
                    todo.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleToggleComplete(todo)}
                          className={`mr-3 flex-shrink-0 ${
                            todo.completed
                              ? 'text-green-600'
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                        >
                          {todo.completed ? (
                            <CheckIcon className="h-6 w-6" />
                          ) : (
                            <XMarkIcon className="h-6 w-6" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3
                            className={`text-lg font-medium ${
                              todo.completed
                                ? 'line-through text-gray-500'
                                : 'text-gray-900'
                            }`}
                          >
                            {todo.title}
                          </h3>
                          {todo.description && (
                            <p className="mt-1 text-sm text-gray-600">
                              {todo.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleEdit(todo)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingTodo ? 'Chỉnh sửa Todo' : 'Thêm Todo mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.completed}
                    onChange={(e) =>
                      setFormData({ ...formData, completed: e.target.checked })
                    }
                  />
                  <span className="ml-2 text-sm text-gray-700">Đã hoàn thành</span>
                </label>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  {editingTodo ? 'Cập nhật' : 'Tạo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

