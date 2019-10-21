// all logout related routes go here
const express = require('express');
const router = express.Router();


router.post('/logout', (req, res) => {
  // delete session cookie by setting it to null
  req.session.username = null;
  res.render('/login');
});
