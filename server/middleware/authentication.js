const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        const user = await User.findById(req.user.userId);
        if (!user) {
        return res.status(401).json({ message: 'User not found, authorization denied' });
        }
        req.user.role = user.role;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authenticate;