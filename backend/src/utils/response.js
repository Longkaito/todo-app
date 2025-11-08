/**
 * Response utility - Format response thống nhất
 */

/**
 * Success response
 */
export const success = (res, data = null, message = null, statusCode = 200) => {
  const response = {
    success: true,
  };

  if (message) {
    response.message = message;
  }

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response
 */
export const error = (
  res,
  message,
  statusCode = 400,
  errors = null,
  metadata = null
) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (metadata) {
    Object.assign(response, metadata);
  }

  return res.status(statusCode).json(response);
};

/**
 * Created response (201)
 */
export const created = (res, data, message = null) => {
  return success(res, data, message, 201);
};

/**
 * Not found response (404)
 */
export const notFound = (res, message = "Không tìm thấy") => {
  return error(res, message, 404);
};

/**
 * Unauthorized response (401)
 */
export const unauthorized = (res, message = "Chưa xác thực") => {
  return error(res, message, 401);
};

/**
 * Forbidden response (403)
 */
export const forbidden = (res, message = "Không có quyền truy cập") => {
  return error(res, message, 403);
};

/**
 * Conflict response (409)
 */
export const conflict = (res, message = "Dữ liệu đã tồn tại") => {
  return error(res, message, 409);
};

/**
 * Bad request response (400)
 */
export const badRequest = (
  res,
  message = "Dữ liệu không hợp lệ",
  errors = null
) => {
  return error(res, message, 400, errors);
};

/**
 * Server error response (500)
 */
export const serverError = (res, message = "Lỗi server") => {
  return error(res, message, 500);
};
