// all login related routes go here
const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');

module.exports = (db) => {

  // client request for login page
  router.get('/login', (req, res) => {
    res.render('login', { loginAttempt: true });
  });

  // client post to login
  router.post('/login', (req, res) => {

    const username = req.body.username;

    db.fetchProfile(username)
      .then(user => {
        console.log(user);

        if (user[0].password === req.body.password) {
          res.render('index');
        } else {
          res.render('login', {loginAttempt: false});
        }
      })
      .catch(error => {
        console.error(error.stack);
      });
  });

  return router;
};
