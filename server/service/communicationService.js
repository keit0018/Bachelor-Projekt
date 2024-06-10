const { CommunicationIdentityClient } = require('@azure/communication-identity');
const config = require('../config/config');

const client = new CommunicationIdentityClient(config.acsConnectionString);

const createUserAndToken = async () => {
  const identityResponse = await client.createUser();
  const tokenResponse = await client.getToken(identityResponse, ["voip"]);
  return { user: identityResponse, token: tokenResponse.token };
};

module.exports = {
  createUserAndToken
};