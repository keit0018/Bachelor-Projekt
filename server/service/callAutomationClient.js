const { CallAutomationClient } = require('@azure/communication-call-automation');
const { DefaultAzureCredential } = require('@azure/identity');
const config = require('../config/config');

const connectionString = config.acsConnectionString;

const callAutomationClient = new CallAutomationClient(connectionString);

module.exports = callAutomationClient;