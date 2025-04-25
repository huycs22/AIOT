const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/auth');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const match  = header.match(/^Bearer (.+)$/);
  if (!match) return res.status(401).json({ error: 'No token provided' });

  const token = match[1];
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = { id: decoded.id, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
