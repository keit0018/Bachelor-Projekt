const express = require('express');
const communicationController = require('../controllers/communicationController');
const router = express.Router();

router.post('/getToken', communicationController.getToken);

module.exports = router;