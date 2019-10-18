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
module.exports = doesUserExist;


