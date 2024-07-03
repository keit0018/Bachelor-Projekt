const Recording = require('../models/recordings');
const { CallAutomationClient } = require('@azure/communication-call-automation');
const { BlobServiceClient } = require('@azure/storage-blob');
const config = require('../config/config');

const acsConnectionString = config.acsConnectionString;
const blobConnectionString = config.blobConnectionString;
const callAutomationClient = new CallAutomationClient(acsConnectionString);
const blobServiceClient = BlobServiceClient.fromConnectionString(blobConnectionString);

exports.startRecording = async (req, res) => {
    const { meetingId, serverCallId, userId, createdBy } = req.body;
  
    const callLocator = { id: serverCallId, kind: "serverCallLocator" };
  
    const options = {
      callLocator: callLocator,
      recordingContent: "composite", // Use composite for video + audio
      recordingChannel: "mixed",
      recordingFormat: "mp4", // Use mp4 for video + audio
      recordingStateCallbackEndpointUrl: "YOUR_CALLBACK_URL",
      recordingStorage: {
        recordingStorageKind: "azureBlobStorage",
        recordingDestinationContainerUrl: config.blobContainerURL
      }
    };
  
    try {
      const response = await callAutomationClient.getCallRecording().start(options);
      res.status(200).send({ message: 'Recording started', recordingId: response.recordingId });
    } catch (error) {
      res.status(500).send({ message: 'Failed to start recording', error: error.message });
    }
  };