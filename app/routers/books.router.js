const auth = require('../../authentication/auth');

const attachTo = (app, data) => {
  app.get('/books', (req, res) => {
    return data.books.getAll()
      .then((books) => {
        if (books.length > 0) {
          return res.status(200).json({
            books: books,
          });
        }
        res.status(401).json({
          error: 'No books',
        });
      });
  });

  app.post('/books', auth, (req, res) => {
    const book = req.body;
    return data.books.create(book)
      .then((dbItem) => {
        res.status(201).json({
          message: 'The book is successfuly added!',
        });
      })
      .catch((err) => {
        res.status(401).json(err);
      });
  });
};

module.exports = {attachTo};
