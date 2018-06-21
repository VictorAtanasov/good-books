const attachTo = (app, data) => {
  app.post('/auth/login', (req, res) => {
    // const user = req.body;
  });

  app.post('/auth/register', (req, res) => {
    const user = req.body;
    return data.users.register(user)
      .then((dbItem) => {
        res.status(201).json({
          message: 'Successful Registration',
        });
      })
      .catch((err) => {
        res.status(200).json(err);
      });
  });
};

module.exports = {attachTo};
