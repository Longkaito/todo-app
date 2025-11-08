import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout";
import { usersService } from "../services/users.service";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  // Thêm state để lưu lỗi cho từng field
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    general: "", // Lỗi chung không thuộc field nào
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await usersService.getAll({ page: 1, limit: 100 });
      setUsers(response.users);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể tải danh sách users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setFormData({ username: "", email: "", password: "", role: "user" });
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    });
    setError(""); // Clear error khi mở modal
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
    });
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    });
    setError(""); // Clear error khi mở modal
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa user này?")) return;

    try {
      await usersService.delete(id);
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Không thể xóa user");
    }
  };

  // Hàm validate client-side (optional, có thể bỏ qua nếu chỉ validate từ server)
  const validateForm = () => {
    const errors = {
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    };
    let isValid = true;

    // Validate username
    if (!editingUser && !formData.username.trim()) {
      errors.username = "Username là bắt buộc";
      isValid = false;
    } else if (
      formData.username.trim() &&
      (formData.username.length < 3 || formData.username.length > 30)
    ) {
      errors.username = "Username phải từ 3-30 ký tự";
      isValid = false;
    } else if (
      formData.username.trim() &&
      !/^[a-zA-Z0-9_]+$/.test(formData.username)
    ) {
      errors.username = "Username chỉ chứa chữ, số và dấu gạch dưới";
      isValid = false;
    }

    // Validate email
    if (!editingUser && !formData.email.trim()) {
      errors.email = "Email là bắt buộc";
      isValid = false;
    } else if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      errors.email = "Email không hợp lệ";
      isValid = false;
    }

    // Validate password
    if (!editingUser && !formData.password.trim()) {
      errors.password = "Mật khẩu là bắt buộc";
      isValid = false;
    } else if (formData.password.trim() && formData.password.length < 6) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      isValid = false;
    } else if (
      formData.password.trim() &&
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)
    ) {
      errors.password = "Mật khẩu phải chứa chữ hoa, chữ thường và số";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  // Hàm parse lỗi từ server response
  const parseServerErrors = (errorResponse) => {
    const errors = {
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    };

    // Parse errors từ Joi validation
    if (errorResponse?.errors && Array.isArray(errorResponse.errors)) {
      errorResponse.errors.forEach((err) => {
        if (err.field === "username") {
          errors.username = err.message;
        } else if (err.field === "email") {
          errors.email = err.message;
        } else if (err.field === "password") {
          errors.password = err.message;
        } else if (err.field === "role") {
          errors.role = err.message;
        }
      });
    }

    // Parse message chung từ server (ví dụ: "Email hoặc username đã tồn tại")
    if (errorResponse?.message) {
      const message = errorResponse.message;

      // Kiểm tra nếu message liên quan đến username
      if (message.toLowerCase().includes("username")) {
        if (errors.username) {
          errors.username = `${errors.username}. ${message}`;
        } else {
          errors.username = message;
        }
      }

      // Kiểm tra nếu message liên quan đến email
      if (message.toLowerCase().includes("email")) {
        if (errors.email) {
          errors.email = `${errors.email}. ${message}`;
        } else {
          errors.email = message;
        }
      }

      // Nếu không map được vào field nào, đặt vào general
      if (
        !message.toLowerCase().includes("username") &&
        !message.toLowerCase().includes("email") &&
        !message.toLowerCase().includes("password")
      ) {
        errors.general = message;
      }
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear errors trước khi submit
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    });
    setError("");

    // Validate client-side (optional)
    // if (!validateForm()) {
    //   return;
    // }

    setIsSubmitting(true);

    try {
      if (editingUser) {
        const updateData = {
          username: formData.username,
          email: formData.email,
          role: formData.role,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await usersService.update(editingUser.id, updateData);
      } else {
        await usersService.create(formData);
      }
      setShowModal(false);
      setFieldErrors({
        username: "",
        email: "",
        password: "",
        role: "",
        general: "",
      });
      loadUsers();
    } catch (err) {
      // Parse lỗi từ server
      const serverErrors = parseServerErrors(err.response?.data);
      setFieldErrors(serverErrors);

      // Nếu có lỗi chung, cũng set vào error state để hiển thị ở ngoài
      if (serverErrors.general) {
        setError(serverErrors.general);
      } else {
        setError("Có lỗi xảy ra. Vui lòng kiểm tra lại thông tin.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm clear error khi user nhập lại
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error của field đó khi user bắt đầu nhập lại
    if (fieldErrors[field]) {
      setFieldErrors({ ...fieldErrors, [field]: "", general: "" });
    }
  };

  // Hàm đóng modal và clear errors
  const handleCloseModal = () => {
    setShowModal(false);
    setFieldErrors({
      username: "",
      email: "",
      password: "",
      role: "",
      general: "",
    });
    setError("");
  };

  return (
    <Layout>
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Users</h2>
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm User
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
          ) : (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      ID
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Username
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Ngày tạo
                    </th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-900 sm:pl-6">
                        {user.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingUser ? "Chỉnh sửa User" : "Thêm User mới"}
            </h3>

            {/* Hiển thị lỗi chung nếu có */}
            {fieldErrors.general && (
              <div className="mb-4 rounded-md bg-red-50 p-3 border border-red-200">
                <p className="text-sm text-red-800">{fieldErrors.general}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username {!editingUser && "*"}
                </label>
                <input
                  type="text"
                  required={!editingUser}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.username
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
                {fieldErrors.username && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email {!editingUser && "*"}
                </label>
                <input
                  type="email"
                  required={!editingUser}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {!editingUser && "*"}
                  {editingUser && (
                    <span className="text-xs text-gray-500 ml-1">
                      (để trống nếu không đổi)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                    fieldErrors.role
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                {fieldErrors.role && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.role}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Đang xử lý..."
                    : editingUser
                    ? "Cập nhật"
                    : "Tạo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};
