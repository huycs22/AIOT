const User      = require('../models/user.model');
const bcrypt    = require('bcryptjs');
const jwt       = require('jsonwebtoken');
const { jwtSecret } = require('../../config/auth');
const crypto    = require('crypto');
const { jwtDecode } = require("jwt-decode");

function signAccessToken(user) {
  console.log("ENCODE", user.email, user.first_name)

  token = jwt.sign(
    { id: user._id, email: user.email, first_name: "Nguyen", last_name: "Huy" },
    jwtSecret,
    { expiresIn: '15m' }
  );
  const decoded = jwtDecode(token);
  console.log("DECODED", decoded)
  return token
}
function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '7d' });
}

// — Signup
async function signup(data) {
  data.password = await bcrypt.hash(data.password, 10);
  const user    = await User.create(data);
  const access  = signAccessToken(user);
  const refresh = signRefreshToken(user);
  return { user, access, refresh };
}

// — Login
async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  if (!(await bcrypt.compare(password, user.password))) throw new Error('Invalid credentials');

  const access  = signAccessToken(user);
  const refresh = signRefreshToken(user);
  console.log("LOGIN", access, refresh)
  return { access, refresh };
}

// — Refresh tokens
async function refreshTokens({ refresh }) {
  let decoded;
  try { decoded = jwt.verify(refresh, jwtSecret); }
  catch { throw new Error('Invalid refresh token'); }

  const user = await User.findById(decoded.id);
  if (!user) throw new Error('User not found');

  const access = signAccessToken(user);
  return { access };
}

// — Get profile
async function getProfile(userId) {
  return await User.findById(userId).select('-password');
}

// — Update profile
async function updateProfile(userId, data) {
  return await User.findByIdAndUpdate(userId, data, { new: true, runValidators: true }).select('-password');
}

// — Update avatar URL
async function updateAvatar(userId, avatarUrl) {
  return await User.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select('-password');
}

// — Password reset request: issue a reset token (JWT)
async function requestPasswordReset(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email not found');

  // sign a short‐lived token
  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
  // TODO: send `token` by email to user.email
  return token;
}

// — Confirm reset
async function confirmPasswordReset(token, newPassword) {
  let decoded;
  try { decoded = jwt.verify(token, jwtSecret); }
  catch { throw new Error('Invalid or expired reset token'); }

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(decoded.id, { password: hashed });
  return true;
}

module.exports = {
  signup,
  login,
  refreshTokens,
  getProfile,
  updateProfile,
  updateAvatar,
  requestPasswordReset,
  confirmPasswordReset
};
