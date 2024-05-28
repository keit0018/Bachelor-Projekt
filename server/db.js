const sql = require('mssql');
const { DefaultAzureCredential } = require('@azure/identity');
const config = require('./dbConfig');

async function connectToDatabase() {
  const credential = new DefaultAzureCredential();
  const accessToken = await credential.getToken("https://database.windows.net/.default");

  const dbConfig = {
    ...config,
    authentication: {
      type: 'azure-active-directory-access-token',
      options: {
        token: accessToken.token
      }
    }
  };

  try {
    let pool = await sql.connect(dbConfig);
    console.log('Connected to the database');
    return pool;
  } catch (err) {
    console.error('Database connection failed: ', err);
    throw err;
  }
}

async function queryDatabase() {
  const pool = await connectToDatabase();
  
  try {
    const result = await pool.request().query('SELECT TOP 1 * FROM Users');
    return result.recordset;
  } catch (err) {
    console.error('Query failed: ', err);
    throw err;
  } finally {
    pool.close();
  }
}

module.exports = { queryDatabase };