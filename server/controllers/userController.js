const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/config');


exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({  userId: user._id, 
                                role: user._role,
                                communicationUserId: user.communicationUserId, 
                                username: user.username }, 
                                config.jwtSecret, 
                                { expiresIn: '1h' });
      res.status(200).json({    token, 
                                userId: user._id, 
                                role: user.role, 
                                communicationUserId: user.communicationUserId, 
                                username: user.username });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

exports.searchUsers = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Find users whose usernames match the search query (case-insensitive)
    const users = await User.find({ username: new RegExp(query, 'i') });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};