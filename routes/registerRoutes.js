// all register related routes go here
const express = require('express');
const router = express.Router();

module.exports = (db) => {

  // client request for login page
  router.get('login', (req, res) => {
    res.render('../views/login');
  });

  // client post to login
  router.post('login', (req, res) => {

    const username = req.body.username;

    db.fetchProfile(username)
      .then(user => {
        res.send(user);
        console.log(user);

        // if password = password => render /
      })
      .catch(error => {
        console.error(error.stack);
      });
  });

  return router;
};
