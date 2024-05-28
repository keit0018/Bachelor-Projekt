require('dotenv').config();

const config = {
  server: process.env.DB_SERVER,     // e.g., 'your_db_server.database.windows.net'
  database: process.env.DB_DATABASE, // e.g., 'your_database'
  options: {
    encrypt: true,                   // Use this if you're on Windows Azure
    enableArithAbort: true
  }
};

module.exports = config;