import { error, notFound, conflict, serverError } from "../utils/response.js";

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Xử lý CORS errors
  if (err.message === "Not allowed by CORS") {
    console.error("CORS Error - Origin not allowed:", req.headers.origin);
    return res.status(403).json({
      success: false,
      message: "CORS: Origin không được phép",
      origin: req.headers.origin,
    });
  }

  if (err.name === "ValidationError") {
    return error(res, "Dữ liệu không hợp lệ", 400, err.errors);
  }

  if (err.code === "SQLITE_CONSTRAINT" || err.name === "SequelizeUniqueConstraintError") {
    return conflict(res, "Dữ liệu đã tồn tại");
  }

  if (err.name === "SequelizeValidationError") {
    const errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return error(res, "Dữ liệu không hợp lệ", 400, errors);
  }

  return serverError(res, err.message || "Lỗi server");
};

export const notFoundHandler = (req, res) => {
  return notFound(res, "Route không tồn tại");
};
