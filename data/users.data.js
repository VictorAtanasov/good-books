const BaseData = require('./base/base.data');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

class UserData extends BaseData {
  constructor(db) {
    super(db, User, User);
  };

  checkEmail(payload) {
    return this.findByKey('email', payload.email)
      .then((result) => {
        return result;
      });
  }

  hashPassword(payload) {
    return bcrypt.hash(payload.password, 10, (err, hash) => {
      if (err) {
        return Promise.reject(err);
      } else {
        payload.password = hash;
        return this.collection.insert(payload);
      }
    });
  }

  comparePasswords(payload) {
    let promise = new Promise((res, rej) => {
      bcrypt.compare(payload.password, payload.dbPassword, (err, response) => {
        if (response) {
          const token = jwt.sign({
            email: payload.email,
            userId: payload.id,
          }, config.jwtKey);
          const resp = {
            email: payload.email,
            username: payload.username,
            token: token,
          };
          res(resp);
        } else {
          rej('Auth failed!');
        }
      });
    });
    return promise;
  }

  login(payload) {
    let validation = this.validator.isValidLogin(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    return this.checkEmail(payload)
      .then((data) => {
        if (data.length === 0) {
          return Promise.reject('Auth failed. Please check your email address!');
        } else {
          payload.username = data[0].username;
          payload.dbPassword = data[0].password;
          payload.id = data[0]['_id'];
          return this.comparePasswords(payload);
        }
      });
  }

  register(payload) {
    let validation = this.validator.isValid(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    return this.checkEmail(payload)
      .then((data) => {
        if (data.length > 0) {
          return Promise.reject('This email is already used');
        } else {
          return this.hashPassword(payload);
        }
      });
  }
}

module.exports = UserData;
