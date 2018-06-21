const BooksData = require('./books.data');
const UsersData = require('./users.data');

const init = (db) => {
  return Promise.resolve({
    books: new BooksData(db),
    users: new UsersData(db),
  });
};

module.exports = {init};
