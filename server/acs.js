const { CommunicationIdentityClient } = require('@azure/communication-identity');
require('dotenv').config();

const connectionString = process.env.ACS_CONNECTION_STRING;

const identityClient = new CommunicationIdentityClient(connectionString);

async function createUserAndToken() {
  try {
    const user = await identityClient.createUser();
    const tokenResponse = await identityClient.getToken(user, ["voip"]);

    return {
      userId: user.communicationUserId,
      token: tokenResponse.token
    };
  } catch (err) {
    console.error('Failed to create ACS user and token', err);
    throw err;
  }
}

module.exports = { createUserAndToken };