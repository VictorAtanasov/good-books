const BaseData = require('./base/base.data');
const Book = require('../models/book.model');

class BooksData extends BaseData {
  constructor(db) {
    super(db, Book, Book);
  };
}

module.exports = BooksData;
