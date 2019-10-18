// pool setup
const db = require('./poolSetup');


// retrieves a table row with username if exists. Row will be empty otherwise
const doesUserExist = function(username) {

  const queryVars = [username];

  return db.query(`
  SELECT username
  FROM users
  WHERE username = $1;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};


// adds a user to the database
const addUser = function(user) {

  const queryVars = [user.username, user.password, 'http://www.messagescollection.com/wp-content/uploads/2015/04/cute-fb-profile-picture.jpg'];

  return db.query(`
  INSERT INTO users (username, password, profile_picture)
  VALUES($1, $2, $3)
  RETURNING *;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};


//



module.exports = { doesUserExist };

