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
    payload.rating = 0;
    payload.totalRating = 0;
    payload.ratingsCount = 0;
    payload.reviewsCount = 0;
    return this.collection.insert(payload);
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
        // console.log(typeof newData.rating);
        return this.updateItem(id, newData);
      })
      .catch((err) => {
        return Promise.reject('Please provide valid id');
      });
  }
}

module.exports = BooksData;
