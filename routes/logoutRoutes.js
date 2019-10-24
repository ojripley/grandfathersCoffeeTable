// all logout related routes go here
const express = require('express');
const router = express.Router();

module.exports = () => {
  router.post('/logout', (req, res) => {
    delete req.session.username;

    res.clearCookie('username');

    res.redirect('/');
  });

  return router;
};
