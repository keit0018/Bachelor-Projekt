const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');
const attendenceController = require('../controllers/attendenceController');
const checkRole = require('../middleware/checkRole');


router.post('/mark',authenticate,checkRole(['worker', 'admin']), attendenceController.markAttendance);

module.exports = router;