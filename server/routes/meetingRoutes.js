const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetings');
const authenticate = require('../middleware/authenticate'); // Middleware to authenticate the user

// Route to create a new meeting
router.post('/create', authenticate, meetingsController.createMeeting);

// Route to get all meetings
router.get('/getAllMeetings', authenticate, meetingsController.getMeetings);

module.exports = router;