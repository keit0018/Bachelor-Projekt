require('dotenv').config();

module.exports = {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    acsConnectionString: process.env.ACS_CONNECTION_STRING
  };