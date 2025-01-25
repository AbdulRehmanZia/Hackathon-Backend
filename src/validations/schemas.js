import Joi from "joi";

const registerSchema = Joi.object({
  fullname: Joi.string().max(20).required().messages({
    "string.max": "Fullname cannot exceed 20 characters.",
    "any.required": "Please provide your fullname.",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),

  password: Joi.string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
      "string.pattern.base":
        "Password must contain one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),

  profileImg: Joi.any().optional(),

  city: Joi.string().optional().messages({
    "string.empty": "City cannot be empty.",
  }),

  country: Joi.string().optional().messages({
    "string.empty": "Country cannot be empty.",
  }),
});

const editUserSchema = Joi.object({
  fullname: Joi.string().max(20).optional().messages({
    "string.max": "Fullname cannot exceed 20 characters.",
  }),

  email: Joi.string().email().optional().messages({
    "string.email": "Please provide a valid email address.",
  }),

  password: Joi.string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .optional()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
      "string.pattern.base":
        "Password must contain one uppercase letter, one lowercase letter, one number, and one special character.",
    }),

  city: Joi.string()
    .optional()
    .messages({ "string.empty": "City cannot be empty." }),

    country: Joi.string()
    .optional()
    .messages({ "string.empty": "Country cannot be empty." }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string()
    .min(8)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
      "string.pattern.base":
        "Password must contain one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

export { registerSchema, editUserSchema, loginSchema };
