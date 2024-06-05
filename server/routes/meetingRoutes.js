const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetings');
const authenticate = require('../middleware/authentication');
const checkRole = require('../middleware/checkRole'); // Middleware to authenticate the user

// Route to create a new meeting
router.post('/', authenticate,checkRole('worker'), meetingsController.createMeeting);
// Route to get all meetings
router.get('/created', authenticate, checkRole('worker'), meetingsController.getCreatedMeetings);
router.get('/participating', authenticate, meetingsController.getParticipatingMeetings);
router.put('/:id',checkRole('worker'),meetingsController.updateMeeting);
router.delete('/:id', checkRole('worker'),meetingsController.deleteMeeting);



module.exports = router;