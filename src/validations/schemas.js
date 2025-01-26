import Joi from "joi";

const registerSchema = Joi.object({
  CNIC: Joi.string()
    .required()
    .pattern(/^\d{5}-\d{7}-\d{1}$/) // Example: 12345-6789012-3
    .messages({
      "any.required": "CNIC is required.",
      "string.pattern.base": "CNIC must follow the format XXXXX-XXXXXXX-X.",
    }),

  name: Joi.string()
    .max(30)
    .required()
    .messages({
      "string.max": "Name cannot exceed 30 characters.",
      "any.required": "Name is required.",
    }),

  password: Joi.string()
    .min(8)
    .max(20)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password cannot exceed 20 characters.",
      "string.pattern.base":
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),

  role: Joi.string()
    .valid("admin", "receptionist", "staff")
    .required()
    .messages({
      "any.only": "Role must be admin, receptionist, or staff.",
      "any.required": "Role is required.",
    }),

  department: Joi.when("role", {
    is: "staff",
    then: Joi.string().required().messages({
      "any.required": "Department is required for staff.",
    }),
    otherwise: Joi.forbidden(),
  }),
});

const editUserSchema = Joi.object({
  name: Joi.string()
    .max(50)
    .optional()
    .messages({
      "string.max": "Name cannot exceed 50 characters.",
    }),

  password: Joi.string()
    .min(8)
    .max(20)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .optional()
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.max": "Password cannot exceed 20 characters.",
      "string.pattern.base":
        "Password must include one uppercase letter, one lowercase letter, one number, and one special character.",
    }),

  department: Joi.string().optional(),
});

const loginSchema = Joi.object({
  CNIC: Joi.string()
    .required()
    .pattern(/^\d{5}-\d{7}-\d{1}$/)
    .messages({
      "any.required": "CNIC is required.",
      "string.pattern.base": "Invalid CNIC format.",
    }),

  password: Joi.string()
    .required()
    .messages({
      "any.required": "Password is required.",
    }),
});

const beneficiarySchema = Joi.object({
  CNIC: Joi.string()
    .required()
    .pattern(/^\d{5}-\d{7}-\d{1}$/) // Example: 12345-6789012-3
    .messages({
      "any.required": "CNIC is required.",
      "string.pattern.base": "CNIC must follow the format XXXXX-XXXXXXX-X.",
    }),

  name: Joi.string()
    .max(50)
    .required()
    .messages({
      "string.max": "Name cannot exceed 50 characters.",
      "any.required": "Name is required.",
    }),

  phone: Joi.string()
    .required()
    .messages({
      "any.required": "Phone number is required.",
    }),

  address: Joi.string()
    .required()
    .messages({
      "any.required": "Address is required.",
    }),

  purpose: Joi.string()
    .valid("financial aid", "medical assistance", "education", "other")
    .required()
    .messages({
      "any.required": "Purpose is required.",
      "any.only": "Purpose must be one of 'financial aid', 'medical assistance', 'education', or 'other'.",
    }),

  createdBy: Joi.string()
    .required()
    .messages({
      "any.required": "Creator (user) is required.",
    }),
});


export { registerSchema, beneficiarySchema, editUserSchema,  loginSchema };