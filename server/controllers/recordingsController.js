const callAutomationClient = require('../service/callAutomationClient');
const Recording = require('../models/recordings');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, StorageSharedKeyCredential  } = require('@azure/storage-blob');
const config = require('../config/config');

const client = callAutomationClient;
const containerName = "videomeetingrecordings";
const blobServiceClient = BlobServiceClient.fromConnectionString(config.blobConnectionString); 
const containerClient = blobServiceClient.getContainerClient(containerName);
const sharedKeyCredential = new StorageSharedKeyCredential(config.blobStorageAccountName, config.blobStorageAccountKey);


async function generateBlobSasUrl(blobUrl) {
  const blobName = blobUrl.replace('https://videoplatformoptagelser.blob.core.windows.net/videomeetingrecordings/','');
  console.log("blobname: ",blobName)
  const blobClient = containerClient.getBlobClient(blobName);
  const expiresOn = new Date(new Date().valueOf() + 3600 * 1000); // SAS token expires in 1 hour

  const sasToken = generateBlobSASQueryParameters({
    containerName,
    blobName,
    permissions: BlobSASPermissions.parse("r"), 
    expiresOn
  }, sharedKeyCredential).toString();
  console.log("sas url: ", blobClient,"sas token: ", sasToken);

  return `${blobClient.url}?${sasToken}`;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}


async function getRecordingUrlFromBlobStorage(date, callId) {
  try{
    const prefix = `${date}/${callId}`;
    // List blobs under the prefix to find the folder
    const blobs = containerClient.listBlobsFlat();
    for await (const item of blobs) {
      let currentItem = item.name.toString();
      if(currentItem.includes(prefix) && currentItem.endsWith('mp4')){
        const blobClient = containerClient.getBlobClient(item.name);
        console.log("item: ", item); // Debugging items
        console.log('MP4 file found: ', blobClient.url);
        console.log("item: ", item);
        return blobClient.url;
      }
    }

    return null;

  } catch(error){
    console.log(error)
  }
}

async function pollForRecordingUrl(date, callId, maxRetries = 10, delay = 10000) {
  let retries = 0;

  while (retries < maxRetries) {
    const recordingUrl = await getRecordingUrlFromBlobStorage(date, callId);
    if (recordingUrl) {
      return recordingUrl;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    retries += 1;
  }

  throw new Error('Recording URL not found after maximum retries.');
}

exports.startRecording = async function (req, res) {
  try {
    const { serverCallId, meetingId, createdBy } = req.body;

    if (!serverCallId || String(serverCallId).trim() === "") {
      return res.status(400).json("serverCallId is invalid");
    }

    let recording = await Recording.findOne({ meetingId });

    if (recording) {
      // Delete the existing recording
      await Recording.deleteOne({ meetingId });
      console.log(`Deleted existing recording for meeting ID: ${meetingId}`);
    }

    var locator = { id: serverCallId, kind: "serverCallLocator" };
    var options = {
      callLocator: locator,
      recordingContent: "audioVideo",
      recordingChannel: "mixed",
      recordingFormat: "mp4",
      recordingStorage: {
        recordingStorageKind: "azureBlobStorage",
        recordingDestinationContainerUrl: config.blobContainerURL
      }
    };
    var startRecordingRequestOutput = await client.getCallRecording().start(options);
    let recordingId = startRecordingRequestOutput.recordingId;
   
    console.log("START CALL RECORDING: ", recordingId);
    // Save the initial recording metadata to MongoDB


    recording = new Recording({
      meetingId,
      createdby: createdBy,
      endTime: null, // Initial value, to be updated when recording stops
      recordingId: recordingId
    });
    await recording.save();
    

    res.json(startRecordingRequestOutput);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

exports.stopRecording = async function (req, res) {
  try {
    const { meetingId, callId } = req.body;

    console.log("callid: ", callId);

    const recording = await Recording.findOne({ meetingId });

    if (!recording) {
      return res.status(404).json("Recording not found for meetingId: " + recording);
    }
    
    await client.getCallRecording().stop(recording.recordingId);
    
    let currentdate = new Date();
    recording.endTime = currentdate.toISOString();

    let linkdate = formatDate(currentdate);
    const recordUrl = await pollForRecordingUrl(linkdate, callId);
    recording.recordingurl = recordUrl;
    await recording.save();

    recording.recordingurl = recordUrl;
    await recording.save();

    res.json("Recording stopped successfully");
  } catch (e) {
    console.log(e.message);
    res.status(500).json(e.message);
  }
};

exports.getRecordingsForUser = async function (req, res) {
  try {
    const userId = req.headers['userid'];
    console.log(userId);
    const recordings = await Recording.find({ createdby: userId });
    res.json(recordings);
  } catch (e) {
    console.log(e.message);
    res.status(500).json(e.message);
  }
};

exports.getVideoLink = async function(req,res){
  try {
    const { recordingId } = req.query;
    const recording = await Recording.findOne({ recordingId });

    if (!recording) {
      return res.status(404).json("Recording not found");
    }

    const sasUrl = await generateBlobSasUrl(recording.recordingurl);
    console.log(sasUrl);
    res.json({ sasUrl });
    
  } catch (e) {
    res.status(500).json(e.message); 
  }
}