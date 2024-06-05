const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const authenticate = require('../middleware/authentication');


router.post('/login', userController.login);
router.get('/search', userController.searchUsers);
router.get('/profile', authenticate, userController.getProfile);

module.exports = router;