// all register related routes go here
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

module.exports = (db) => {

  // client request for login page
  router.get('/register', (req, res) => {

    if (req.session.username) {
      res.redirect('/');
    } else {
      res.render('register', { registerAttempt: true });
    }
  });

  // client post to login
  router.post('/register', (req, res) => {

    const username = req.body.username;
    const user = req.body;
    user.password = bcrypt.hashSync(user.password, 10);
    console.log(user.password);
    db.doesUserExist(username)
      .then(rows => {
        if (rows.length === 0) {
          db.addUser(user)
            .then(() => {

              // sets username cookie
              req.session.username = req.body.username;

              res.cookie('username', req.body.username);

              res.redirect('/');
            })
            .catch(error => {
              console.error(error.stack);
            });
        } else {
          res.render('register', { registerAttempt: false });
        }
      })
      .catch(error => {
        console.error(error.stack);
      });
  });
  return router;
};
