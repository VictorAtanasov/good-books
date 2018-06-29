const auth = require('../../middlewares/auth');
const fileUpload = require('../../middlewares/file');

const attachTo = (app, data) => {
  app.get('/books', (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    return data.books.getAll(page, limit)
      .then((dbData) => {
        if (dbData.length > 0) {
          return data.books.countAll()
            .then((counter) => {
              res.status(200).json({
                success: true,
                booksCount: counter,
                payload: dbData,
              });
            });
        }
        res.status(400).json({
          success: false,
          message: 'No books found',
        });
      });
  });

  app.post('/books', fileUpload.upload.single('image'), auth, (req, res) => {
    const book = req.body;
    if (req.file) {
      book.image = req.file.filename;
    } else {
      book.image = 'default.jpg';
    }
    return data.books.createBook(book)
      .then((dbItem) => {
        res.status(201).json({
          success: true,
          message: 'The book is successfuly added!',
          payload: {
            insertedId: dbItem.insertedIds[0],
          },
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });

  app.get('/books/:id', (req, res) => {
    const id = req.params.id;
    return data.books.findById(id)
      .then((dbItem) => {
        if (dbItem.length === 0) {
          res.status(400).json({
            success: false,
            message: 'Nothing is found',
          });
        } else {
          res.status(200).json({
            success: true,
            payload: dbItem,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: err,
        });
      });
  });

  app.put('/books/:id', fileUpload.upload.single('image'), auth, (req, res) => {
    const id = req.params.id;
    const newData = req.body;
    if (req.file) {
      newData.image = req.file.filename;
    }
    return data.books.updateBook(id, newData)
      .then((dbResp) => {
        if (dbResp.result.nModified > 0) {
          res.status(201).json({
            success: true,
            message: 'The book is successfully updated!',
          });
        } else {
          res.status(400).json({
            success: false,
            message: 'There was nothing to update',
          });
        }
      })
      .catch((err) => {
        res.status(500).json({
          success: false,
          message: err,
        });
      });
  });

  app.put('/books/:id/rating', auth, (req, res) => {
    const id = req.params.id;
    const rating = req.body;
    return data.books.addRating(id, rating)
      .then((dbData) => {
        res.status(201).json({
          success: true,
          message: 'The rating is successfully added',
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });

  app.post('/books/:id/comments', auth, (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    return data.books.addComment(id, comment)
      .then((dbData) => {
        res.status(201).json({
          success: true,
          payload: dbData,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });

  app.get('/books/:id/comments', (req, res) => {
    const id = req.params.id;
    return data.books.getComments(id)
      .then((dbData) => {
        if (dbData.length > 0) {
          return res.status(200).json({
            success: true,
            payload: dbData,
          });
        }
        res.status(200).json({
          success: false,
          message: 'This book don\'t have any comments!',
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid book id',
        });
      });
  });

  app.get('/books/search/:collection', (req, res) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const collectionName = req.params.collection;
    return data.books.getAllByCollection(page, limit, collectionName)
      .then((dbData) => {
        if (dbData.length > 0) {
          return res.status(200).json({
            success: true,
            payload: dbData,
          });
        }
        res.status(400).json({
          success: false,
          message: 'No data found',
        });
      });
  });

  app.get('/books/search/:key/:payload', (req, res) => {
    const key = req.params.key.toLowerCase();
    const payload = req.params.payload.toLowerCase().split('-').join(' ');
    const page = req.query.page;
    const limit = req.query.limit;
    return data.books.textQuery(key, payload, page, limit)
      .then((dbData) => {
        if (dbData.length > 0) {
          return res.status(200).json({
            success: true,
            payload: dbData,
          });
        }
        res.status(401).json({
          success: false,
          message: 'Nothing is found! Check your search parameters',
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });
};

module.exports = {attachTo};
