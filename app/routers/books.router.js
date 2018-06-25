const auth = require('../../middlewares/auth');
const fileUpload = require('../../middlewares/file');

const attachTo = (app, data) => {
  app.get('/books', (req, res) => {
    return data.books.getAll()
      .then((books) => {
        if (books.length > 0) {
          return res.status(200).json({
            success: true,
            payload: books,
          });
        }
        res.status(401).json({
          success: false,
          message: 'No books',
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
        console.log(dbItem);
        res.status(201).json({
          success: true,
          message: 'The book is successfuly added!',
          payload: {
            insertedId: dbItem.insertedIds[0],
          },
        });
      })
      .catch((err) => {
        res.status(401).json({
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
          res.status(401).json({
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
          res.status(401).json({
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
        res.status(401).json({
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
        res.status(401).json({
          success: false,
          message: err,
        });
      });
  });
};

module.exports = {attachTo};
