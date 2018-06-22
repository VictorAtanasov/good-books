const attachTo = (app, data) => {
  app.post('/auth/login', (req, res) => {
    const user = req.body;
    return data.users.login(user)
      .then((dbItem) => {
        res.status(201).json({
          message: 'Successful login',
          dbItem,
        });
      })
      .catch((err) => {
        res.status(401).json(err);
      });
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
        res.status(401).json(err);
      });
  });
};

module.exports = {attachTo};
