const express = require('express');
const bodyParser = require('body-parser');

const init = (data) => {
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  require('./routers').attachTo(app, data);

  return Promise.resolve(app);
};


module.exports = {init};
