const auth = require('../../middlewares/auth');
const fileUpload = require('../../middlewares/file');

const attachTo = (app, data) => {
  app.post('/auth/login', (req, res) => {
    const user = req.body;
    return data.users.login(user)
      .then((dbItem) => {
        res.status(201).json({
          success: true,
          message: 'Successful login',
          payload: dbItem,
        });
      })
      .catch((err) => {
        res.status(401).json({
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
        res.status(401).json({
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
        res.status(401).json({
          success: false,
          message: err,
        });
      });
  });

  app.get('/user/:id/books', auth, (req, res) => {
    const id = req.params.id;
    return data.users.findBooksByUser(id)
      .then((dbData) => {
        if (dbData.length === 0) {
          res.status(200).json({
            success: true,
            message: 'No books to show',
          });
        } else {
          res.status(200).json({
            success: true,
            payload: dbData,
          });
        }
      })
      .catch((err) => {
        res.status(401).json({
          success: false,
          message: err,
        });
      });
  });

  app.post('/user/:id/books/owned', auth, (req, res) => {
    const id = req.params.id;
    const bookId = req.body;
    return data.users.userBooksActions(id, bookId, 'ownedBooks')
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
