const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your-secret-key-change-in-production-2024';
const JWT_EXPIRES_IN = '7d';

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyToken
};
