const express = require('express');
const recordingsController = require('../controllers/recordingsController');
const router = express.Router();

router.post('/startRecording', recordingsController.startRecording);
router.post('/stopRecording', recordingsController.stopRecording);

module.exports = router;