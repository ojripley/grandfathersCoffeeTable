// all login related routes go here
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  // client request for login page
  router.get('/login', (req, res) => {

    if (req.session.username) {
      res.redirect('/');
    } else {
      res.render('login', { loginAttempt: true });
    }
  });

  // client post to login
  router.post('/login', (req, res) => {

    const username = req.body.username;

    db.fetchProfile(username)
      .then(user => {
        console.log(user);

        if (bcrypt.compareSync(req.body.password, user[0].password)) {

          // create session cookie
          req.session.username = req.body.username;

          // if we have time, make this an encrypted token later (STRETCH)
          res.cookie(req.body.username);

          res.redirect('/');
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
