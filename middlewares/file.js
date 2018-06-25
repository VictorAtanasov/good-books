const multer = require('multer');
const crypto = require('crypto');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './static/uploads/');
  },
  filename: function(req, file, cb) {
    let id = crypto.randomBytes(20).toString('hex');
    let mimetype = file.mimetype.split('/')[1];
    cb(null, id + '.' + mimetype);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 1MB
  },
  fileFilter: fileFilter,
});

module.exports = {
  upload,
};
