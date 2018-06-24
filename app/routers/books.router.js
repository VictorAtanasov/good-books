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

  app.get('/books/:key', (req, res) => {
    const id = req.params.key;
    return data.books.findById(id)
      .then((dbItem) => {
        if (dbItem.length === 0) {
          res.status(401).json({
            error: 'Nothing is found',
          });
        }
        res.status(200).json(dbItem);
      })
      .catch((err) => {
        res.status(500).json(err);
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
