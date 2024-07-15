require('dotenv').config();

module.exports = {
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    acsConnectionString: process.env.ACS_CONNECTION_STRING,
    blobConnectionString: process.env.BLOB_CONNECTION_STRING,
    blobContainerURL: process.env.BLOB_CONTAINER_URL,
    blobStorageAccount: process.env.BLOB_STORAGE_ACCOUNT,
    blobStorageAccountName: process.env.BLOB_STORAGE_ACCOUNT_NAME,
    blobStorageAccountKey: process.env.BLOB_STORAGE_ACCOUNT_KEY,
    baseUrl: process.env.BASE_URL
  };