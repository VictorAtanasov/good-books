const BaseData = require('./base/base.data');
const Book = require('../models/book.model');

class BooksData extends BaseData {
  constructor(db) {
    super(db, Book, Book);
  };

  createBook(payload) {
    let validation = this.validator.isValid(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    payload = this.removeWhitespace(payload);
    return this.createAuthorCategory(payload)
      .then((payload) => {
        return this.checkTitle(payload.title)
          .then((ifTitle) => {
              if (ifTitle) {
                return Promise.reject('This book already exists');
              }
              payload.rating = 0;
              payload.totalRating = 0;
              payload.ratingsCount = 0;
              return this.collection.insert(payload);
          });
      });
  }

  createAuthorCategory(payload) {
    return this.db.collection('categories').find({
      'name': {$regex: new RegExp(`^${payload.category}$`, 'i')},
    })
      .toArray()
      .then((dbData) => {
        if (dbData.length > 0) {
          payload.category = dbData[0].name;
          return payload;
        } else {
          this.db.collection('categories').insert({
            name: payload.category,
          });
          return payload;
        }
      })
      .then((dbData) => {
        return this.db.collection('authors').find({
          'name': {$regex: new RegExp(`^${payload.author}$`, 'i')},
        })
          .toArray()
          .then((dbData) => {
            if (dbData.length > 0) {
              payload.author = dbData[0].name;
              return payload;
            } else {
              this.db.collection('authors').insert({
                name: payload.author,
              });
              return payload;
            }
          });
      });
  }

  checkTitle(title) {
    return this.collection.find({
      'title': {$regex: new RegExp(`^${title}$`, 'i')},
    })
    .toArray()
    .then((dbData) => {
      if (dbData.length > 0) {
        return true;
      }
      return false;
    });
  }

  updateBook(id, payload) {
    let validation = this.validator.isValidOnUpdate(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    } else {
      return this.updateItem(id, payload);
    }
  }

  addRating(id, value) {
    if (!value.rating || value.rating < 1 || value.rating > 5) {
      return Promise.reject('Please provide new valid rating');
    }
    return this.findById(id)
      .then((dbItem) => {
        const dbData = dbItem[0];
        const newRating = +value.rating;
        const rating = (+dbData.totalRating + newRating) / (+dbData.ratingsCount + 1);
        const newData = {
          rating: rating.toFixed(2),
          totalRating: +dbData.totalRating + newRating,
          ratingsCount: +dbData.ratingsCount + 1,
        };
        return this.updateItem(id, newData);
      })
      .catch((err) => {
        return Promise.reject('Please provide valid id');
      });
  }

  addComment(id, payload) {
    let validation = this.validator.isValidComment(payload);
    if (!validation.isFormValid) {
      return Promise.reject(validation);
    }
    let comment = {
      bookId: id,
      comment: payload.comment,
      title: payload.title,
      commenter: {
        username: payload.username,
        userId: payload.userId,
        avatar: payload.avatar,
      },
    };
    return this.db.collection('comments').insert(comment)
      .then((dbData) => {
        if (dbData.result.ok === 1) {
          return dbData.ops[0];
        } else {
          return Promise.reject('Please provide a valid book id');
        }
      });
  }

  getComments(id) {
    return this.db.collection('comments').find({
      'bookId': id,
    })
    .toArray();
  }
}

module.exports = BooksData;
