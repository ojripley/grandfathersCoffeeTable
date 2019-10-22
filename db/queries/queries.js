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


// fetches entire profile row
const fetchProfile = function(username) {

  const queryVars = [username];

  return db.query(`
  SELECT *
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


// fetches user history
const fetchUserHistory = function(username) {

  const queryVars = [username];

  return db.query(`
  SELECT matches.gametype, results.finished_position, results.score, matches.time_stamp, matches.id
  FROM users
  JOIN results ON user_id = users.id
  JOIN matches ON match_id = matches.id
  WHERE users.username = $1
  GROUP BY users.id, results.id, matches.id
  ORDER BY matches.time_stamp;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};


// fetches match history for a game instance
const fetchMatchDetails = function(id) {

  const queryVars = [id];

  return db.query(`
  SELECT users.username, results.finished_position AS placing, results.score
  FROM results
  JOIN users ON(users.id = results.user_id)
  JOIN matches ON(matches.id = results.match_id)
  WHERE matches.id = $1
  ORDER BY results.finished_position;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};


// insert match
const addMatch = function(gametype) {

  const queryVars = [gametype];

  return db.query(`
    INSERT INTO matches(gametype)
    VALUES($1)
    RETURNING id;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};


// insert results for one user in a match
const addResult = function(matchId, user) {

  const queryVars = [matchId, user.id, user.score, user.posiiton];

  return db.query(`
  INSERT INTO results($1, $2, $3, $4)
  VALUES(8, 1, 200, 1);
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};

// fetches leaderboard for a game type
const fetchLeaderBoard = function(gametype) {

  const queryVars = [gametype];

  return db.query(`
 SELECT users.username, sum(results.score) as users_total_game_score
  FROM users
  JOIN results ON user_id = users.id
  JOIN matches ON match_id = matches.id
  WHERE matches.gametype = $1
  GROUP BY users.username
  ORDER BY users_total_game_score desc
  LIMIT 10;
  `, queryVars)
    .then(res => {
      return res.rows;
    })
    .catch(error => {
      console.error(`Query error ${error.stack}`);
    });
};

module.exports = { doesUserExist, addUser, fetchProfile, fetchUserHistory, fetchMatchDetails, addMatch, addResult, fetchLeaderBoard };
