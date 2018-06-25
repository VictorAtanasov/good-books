const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtKey);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Auth failed',
    });
  }
};
