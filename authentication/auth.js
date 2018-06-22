const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = (req, res, next) => {
  try {
    const decoded = jwt.verify(req.headers.token, config.jwtKey);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
