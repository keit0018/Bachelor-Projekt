const User = require('../models/user');

const checkRole = (roles) => (req, res, next) => {
    console.log(req.user);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
  
module.exports = checkRole;