const svc   = require('../services/user.service');
const {
  signupSchema,
  loginSchema,
  refreshSchema,
  profileUpdateSchema,
  passwordResetRequestSchema,
  passwordResetConfirmSchema
} = require('../validators/user.validator');

exports.signup = async (req, res, next) => {
  try { 
    console.log("HERE", req.body)
    const data = await signupSchema.validateAsync(req.body);
    console.log("DATA", data)
    const result = await svc.signup(data);
    res.status(201).json(result);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const creds = await loginSchema.validateAsync(req.body);
    const result = await svc.login(creds);
    console.log(result)
    res.json(result);
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const obj = await refreshSchema.validateAsync(req.body);
    const result = await svc.refreshTokens(obj);
    res.json(result);
  } catch (err) { next(err); }
};

exports.getProfile = async (req, res, next) => {
  try {
    const profile = await svc.getProfile(req.user.id);
    res.json(profile);
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const data = await profileUpdateSchema.validateAsync(req.body);
    const updated = await svc.updateProfile(req.user.id, data);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/avatars/${req.file.filename}`;
    const updated = await svc.updateAvatar(req.user.id, url);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = await passwordResetRequestSchema.validateAsync(req.body);
    const token = await svc.requestPasswordReset(email);
    res.json({ resetToken: token });
  } catch (err) { next(err); }
};

exports.confirmPasswordReset = async (req, res, next) => {
  try {
    const { token, newPassword } = await passwordResetConfirmSchema.validateAsync(req.body);
    await svc.confirmPasswordReset(token, newPassword);
    res.status(204).end();
  } catch (err) { next(err); }
};
