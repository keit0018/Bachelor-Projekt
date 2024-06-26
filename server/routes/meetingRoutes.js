const express = require('express');
const router = express.Router();
const meetingsController = require('../controllers/meetings');
const authenticate = require('../middleware/authentication');
const checkRole = require('../middleware/checkRole'); // Middleware to authenticate the user
const authorizeMeetingAccess = require('../middleware/AuthorizeMeetingAccess');

// Route to create a new meeting
router.post('/', authenticate,checkRole(['worker', 'admin']), meetingsController.createMeeting);
// Route to get all meetings

router.get('/unattended', authenticate,meetingsController.getUnattendedMeetings);

//get meetings by id: 

//update and delete 
router.put('/:id',authenticate,checkRole(['worker', 'admin']),meetingsController.updateMeeting);
router.delete('/:id', authenticate,checkRole(['worker', 'admin']),meetingsController.deleteMeeting);
router.get('/:id', meetingsController.getMeetingById);

//confirm that user can enter a meeting
router.get('/:id/join', authenticate, authorizeMeetingAccess, (req, res) => {
    res.status(200).json({ message: 'User can join the meeting' });
});



module.exports = router;