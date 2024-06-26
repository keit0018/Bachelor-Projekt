
const { CommunicationIdentityClient } = require('@azure/communication-identity');
const config = require('../config/config');



const getToken = async (req, res) => {
  
  try {
    const connectionString = config.acsConnectionString;
    const identityClient = new CommunicationIdentityClient(connectionString);

    const { communicationUserId } = req.body;

    console.log(communicationUserId);

    if (!communicationUserId) {
      return res.status(400).json({ message: 'Communication user ID is required' });
    }

    // Generate token
    const tokenResponse = await identityClient.getToken({ communicationUserId }, ["voip"]);
    console.log(tokenResponse);
    res.json(tokenResponse);
  } catch (error) {
    console.error('Error generating ACS token:', error);
    res.status(500).json({ message: 'Failed to generate token', error: error.message });
  }
};

module.exports = {
  getToken
};