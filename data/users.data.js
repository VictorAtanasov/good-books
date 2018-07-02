const {ObjectId} = require('mongodb');
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
    return this.findByKeyCaseSensitive('email', payload.email)
      .then((result) => {
        return result;
      });
  }

  hashPassword(payload) {
    let promise = new Promise((resolve, reject) => {
      bcrypt.hash(payload.password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          payload.password = hash;
          resolve(payload);
        }
      });
    });
    return promise;
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
            avatar: payload.avatar,
            token: token,
            userId: payload.id,
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
          payload.avatar = data[0].avatar;
          payload.id = data[0]['_id'];
          payload.email = data[0].email;
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
          return this.hashPassword(payload)
            .then((payload) => {
              return this.collection.insert(payload);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      });
  }

  findBooksByUser(id, page, limit) {
    if (limit === undefined) {
      limit = 5;
    }
    if (page === undefined || page < 1) {
      page = 1;
    }
    const skip = (page - 1) * limit;
    return this.db.collection('books').find({
      'userId': id,
    })
    .skip(+skip)
    .limit(+limit)
    .toArray();
  }

  getUser(id) {
    let userData = {};
    return this.findById(id)
      .then((dbData) => {
        userData.email = dbData[0].email;
        userData.username = dbData[0].username;
        userData.avatar = dbData[0].avatar;
        userData.id = dbData[0]['_id'];
        userData.ownedBooks = dbData[0].ownedBooks;
        return userData;
      })
      .catch((err) => {
        return Promise.reject('Please provide a valid user id');
      });
  }

  addOwnedBook(userId, bookId, key) {
    if (!this.idValidator(userId) || !this.idValidator(bookId)) {
      return Promise.reject('Please provide a valid id');
    }
    const data = {
      bookOwner: userId,
    };
    return this.db.collection('books').update(
      {'_id': ObjectId(bookId)},
      {$addToSet: {
        [key]: data,
      }}
    )
      .then((dbItem) => {
        if (dbItem.result.nModified === 1) {
          return Promise.resolve('Successfuly added!');
        } else {
          return Promise.reject('The book is already marked as owned by that user');
        }
      })
      .catch((err) => {
        return Promise.reject(err);
      });
  }

  updateUser(userId, payload) {
    let validation = this.validator.isValidUpdate(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    return this.checkEmail(payload)
      .then((response) => {
        if (response.length === 0) {
          return Promise.reject('Auth failed. Please check your email address!');
        } else {
          payload.dbPassword = response[0].password;
          payload.id = response[0]['_id'];
          return this.comparePasswords(payload)
            .then((response) => {
              return this.updateUserObject(payload)
                .then((newUserObject) => {
                  return this.updateItem(response.userId, newUserObject);
                });
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }
      });
  }

  updateUserObject(payload) {
    let newUserData = { };
    newUserData.password = payload.password;
    if (payload.newPassword) {
      newUserData.password = payload.newPassword;
    }
    if (payload.avatar) {
      newUserData.avatar = payload.avatar;
    }
    if (payload.username) {
      newUserData.username = payload.username;
    }
    return this.hashPassword(newUserData)
      .then((resp) => {
        return resp;
      });
  }
}

module.exports = UserData;
