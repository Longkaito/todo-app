import Joi from 'joi';

// Middleware để validate với Joi
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors
      });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

// Register validation schema
export const registerValidator = validate(Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username phải từ 3-30 ký tự',
      'string.max': 'Username phải từ 3-30 ký tự',
      'string.pattern.base': 'Username chỉ chứa chữ, số và dấu gạch dưới',
      'any.required': 'Username là bắt buộc'
    }),
  email: Joi.string()
    .email()
    .normalize()
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.pattern.base': 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
      'any.required': 'Mật khẩu là bắt buộc'
    })
}));

// Login validation schema
export const loginValidator = validate(Joi.object({
  email: Joi.string()
    .email()
    .normalize()
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Mật khẩu không được để trống'
    })
}));

// User validation schema for create (for admin)
export const createUserValidator = validate(Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      'string.min': 'Username phải từ 3-30 ký tự',
      'string.max': 'Username phải từ 3-30 ký tự',
      'string.pattern.base': 'Username chỉ chứa chữ, số và dấu gạch dưới',
      'any.required': 'Username là bắt buộc'
    }),
  email: Joi.string()
    .email()
    .normalize()
    .required()
    .messages({
      'string.email': 'Email không hợp lệ',
      'any.required': 'Email là bắt buộc'
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.pattern.base': 'Mật khẩu phải chứa chữ hoa, chữ thường và số',
      'any.required': 'Mật khẩu là bắt buộc'
    }),
  role: Joi.string()
    .valid('admin', 'user')
    .default('user')
    .messages({
      'any.only': 'Role phải là admin hoặc user'
    })
}));

// User validation schema for update (for admin)
export const updateUserValidator = validate(Joi.object({
  username: Joi.string()
    .trim()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .messages({
      'string.min': 'Username phải từ 3-30 ký tự',
      'string.max': 'Username phải từ 3-30 ký tự',
      'string.pattern.base': 'Username chỉ chứa chữ, số và dấu gạch dưới'
    }),
  email: Joi.string()
    .email()
    .normalize()
    .messages({
      'string.email': 'Email không hợp lệ'
    }),
  password: Joi.string()
    .min(6)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
      'string.pattern.base': 'Mật khẩu phải chứa chữ hoa, chữ thường và số'
    }),
  role: Joi.string()
    .valid('admin', 'user')
    .messages({
      'any.only': 'Role phải là admin hoặc user'
    })
}).min(1).messages({
  'object.min': 'Phải có ít nhất một trường để cập nhật'
}));

// Todo validation schema
export const todoValidator = validate(Joi.object({
  title: Joi.string()
    .trim()
    .min(1)
    .max(200)
    .required()
    .messages({
      'string.min': 'Tiêu đề không được để trống',
      'string.max': 'Tiêu đề không được quá 200 ký tự',
      'any.required': 'Tiêu đề là bắt buộc'
    }),
  description: Joi.string()
    .trim()
    .max(1000)
    .allow('', null)
    .messages({
      'string.max': 'Mô tả không được quá 1000 ký tự'
    }),
  completed: Joi.boolean()
    .messages({
      'boolean.base': 'Completed phải là boolean'
    })
}));

// Refresh token validation schema
export const refreshTokenValidator = validate(Joi.object({
  refreshToken: Joi.string()
    .required()
    .messages({
      'any.required': 'Refresh token là bắt buộc'
    })
}));
