const Joi = require('joi');

const signupSchema = Joi.object({
  email:      Joi.string().email().required(),
  password:   Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name:  Joi.string().required()
});

const loginSchema = Joi.object({
  email:    Joi.string().email().required(),
  password: Joi.string().required()
});

const refreshSchema = Joi.object({
  refresh: Joi.string().required()
});

const profileUpdateSchema = Joi.object({
  first_name: Joi.string(),
  last_name:  Joi.string()
}).min(1);

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordResetConfirmSchema = Joi.object({
  token:       Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  signupSchema,
  loginSchema,
  refreshSchema,
  profileUpdateSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema
};
