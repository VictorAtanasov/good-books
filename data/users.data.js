const BaseData = require('./base/base.data');
const User = require('../models/user.model');

class UserData extends BaseData {
  constructor(db) {
    super(db, User, User);
  };
}

module.exports = UserData;
