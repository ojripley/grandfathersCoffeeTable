const db = require('./queries.js');


db.doesUserExist('Owen')
  .then(res => {
    if (res.length > 0) {
      console.log('Send a response indicating that that username already exists');
    } else {
      console.log('User name is available! Allow sign up');
    }
  })
  .catch(error => {
    console.error(error);
  });
