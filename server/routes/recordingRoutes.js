const express = require('express');
const recordingsController = require('../controllers/recordingsController');
const authenticate = require('../middleware/authentication');
const router = express.Router();

router.post('/startRecording', recordingsController.startRecording);
router.post('/stopRecording', recordingsController.stopRecording);
router.get('/getRecordings', recordingsController.getRecordingsForUser);
router.get('/getSecureVideoLink',recordingsController.getVideoLink);

module.exports = router;