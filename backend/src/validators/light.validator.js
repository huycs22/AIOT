// src/validators/light.validator.js
const Joi = require('joi');

// For POST /api/light/control  → { value: 0–100 }
const recordSchema = Joi.object({
  value: Joi.number()
    .min(0)
    .max(100)
    .required()
});

// For PUT /api/light/control/mode  → { manual: true|false }
const controlModeSchema = Joi.object({
  manual: Joi.number()
    .required()
});

module.exports = {
  recordSchema,
  controlModeSchema
};
