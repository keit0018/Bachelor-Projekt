const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
  // Create a payload with user information
  const payload = {
    id: user._id,
    role: user.role
  };

  // Sign the token with a secret key and set an expiration time
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

  return token;
};

module.exports = generateToken;