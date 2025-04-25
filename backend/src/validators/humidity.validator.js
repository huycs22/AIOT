const Joi = require('joi');
const boundSchema = Joi.object({ min: Joi.number().required(), max: Joi.number().required() });
const recordSchema = Joi.object({ value: Joi.number().required() });
module.exports = { boundSchema, recordSchema };