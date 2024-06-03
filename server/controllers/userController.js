const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config');


exports.login = async (req, res) => {
  try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const isMatch = await user.comparePassword(password);
      console.log(`Password match for ${username}: ${isMatch}`);
      
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};