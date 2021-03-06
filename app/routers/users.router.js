const auth = require('../../middlewares/auth');
const fileUpload = require('../../middlewares/file');

const attachTo = (app, data) => {
  app.post('/auth/login', (req, res) => {
    const user = req.body;
    return data.users.login(user)
      .then((dbItem) => {
        res.status(200).json({
          success: true,
          message: 'Successful login',
          payload: dbItem,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });

  app.post('/auth/register', fileUpload.upload.single('avatar'), (req, res) => {
    const user = req.body;
    if (req.file) {
      user.avatar = req.file.filename;
    } else {
      user.avatar = 'person.png';
    }
    return data.users.register(user)
      .then((dbItem) => {
        res.status(201).json({
          success: true,
          message: 'Successful Registration',
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: err,
        });
      });
  });

  app.get('/user/:id', auth, (req, res) => {
    const id = req.params.id;
    return data.users.getUser(id)
      .then((dbData) => {
        res.status(200).json({
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

  app.put('/user/:id', fileUpload.upload.single('avatar'), auth, (req, res) => {
    const user = req.body;
    const id = req.params.id;
    if (req.file) {
      user.avatar = req.file.filename;
    }
    return data.users.updateUser(id, user)
      .then((dbResp) => {
        if (dbResp.result.nModified > 0) {
          res.status(201).json({
            success: true,
            message: 'User data is updated!',
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

  app.get('/user/:id/books', auth, (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    const limit = req.query.limit;
    return data.users.findBooksByUser(id, page, limit)
      .then((dbData) => {
        if (dbData.length === 0) {
          res.status(200).json({
            success: true,
            message: 'No books to show',
          });
        }
        res.status(200).json({
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

  app.post('/user/:id/books/owned', auth, (req, res) => {
    const userId = req.params.id;
    const bookId = req.body.bookId;
    return data.users.addOwnedBook(userId, bookId, 'bookOwners')
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

  app.get('/user/:id/books/owned', auth, (req, res) => {
    const id = req.params.id;
    const page = req.query.page;
    const limit = req.query.limit;
    return data.books.findByKeyPaginated('bookOwners.bookOwner', id, page, limit)
      .then((dbData) => {
        res.status(200).json({
          success: true,
          payload: dbData,
        });
      })
      .catch((err) => {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid user id',
        });
      });
  });
};

module.exports = {attachTo};
