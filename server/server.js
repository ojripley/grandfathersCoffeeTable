// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-session');
const { activePlayers, activeGames } = require('./objects/managers.js');

// PG database client/connection setup
// const { Pool } = require('pg');
// const dbParams = require('../lib/db.js');
// const db = new Pool(dbParams);
// db.connect();

const db = require('../db/queries/queries');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieParser({ signed: false }));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/styles", sass({
//   src: __dirname + "../styles",
//   dest: __dirname + "../public/styles",
//   debug: true,
//   outputStyle: 'expanded'
// }));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("../routes/users");
const widgetsRoutes = require("../routes/widgets");
const loginRoutes = require('../routes/loginRoutes');
const registerRoutes = require('../routes/registerRoutes');
const logoutRoutes = require('../routes/logoutRoutes');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use('/', loginRoutes(db));
app.use('/', registerRoutes(db));
app.use('/', logoutRoutes());
// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {

  if (req.session.username) {
    res.render("index");
  } else {
    res.render('login', {loginAttempt: true});
  }
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

///////////////////////////////////////
// server side socket communications //
///////////////////////////////////////
io.on('connection', (client) => {
  console.log(`client connected: ${client}`);

  // emits are server -> client
  // ons are client -> server

  client.emit('msg', 'Hello from server');
  client.on('msg', (data) => {
    console.log(data);
  });

  client.on('requestGame', (data) => {

    io.to('room').emit('msg', 'Greetings, clients!');
    console.log('data from clients:', data);

    // activeGames[game].id.substring(0, 3) === 'goof'

    activeGames.addGame(data.gametype);
    // need to make a check for if game already exists
    for (let game in activeGames) {
      console.log('GAME ', game);

      // if a game exists and is not full
      if (game.substring(0, 4) === 'goof') {
        console.log(activeGames[game].id);

        if (activeGames[game].players.length < 2) {
          client.join(activeGames[game].id);
          client.emit('newGame', { gameId: game, players: activeGames[game].players });
          // replace the emit data with gameId and players
          break;
        } else {
          client.join(activeGames.addGame(data.gametype));
          client.emit('newGame', { gameId: game, players: activeGames[game].players });
          // replace the emit data with gameId and players
          break;
        }
      }
    }
  });

  client.on('move', (data) => {
    console.log(data);

    // uncomment for move handling

    // activeGames[data.gameId].pendingMoves.push(data.move);
    // if (activeGames[data.gameId].pendingMoves.length === activeGames[data.gameId].players.length) {
    //   activeGames[data.gameId].pushPendingToHistory();
    //   // broadcast the game to all players
    //   io.to('room').emit('gameView', {
    //     players: activeGames[data.gameId].players,
    //     table: activeGames[data.gameId].table,
    //     deck: activeGames[data.gameId].deck,
    //     gameId: data.gameId,
    //     currentPlayerId: activeGames[data.gameId].currentPlayer
    //   });
    // }
  });

  // client requests history of a user (data = a username)
  client.on('requestHistory', (data) => {
    console.log(data);

    db.fetchUserHistory(data)
      .then(res => {
        client.emit('history', res);
      });
  });

  client.on('requestMatchDetails', (data) => {
    console.log(data);

    db.fetchMatchDetails(data)
      .then(res => {
        client.emit('matchDetails', res);
      });
  });

  client.on('requestLeaderBoard', (data) => {

    db.fetchLeaderBoard(data)
      .then(res => {
        client.emit('leaderBoard', res);
      });
  });

  // CHANGE ROOM TO DYNMAIC ROOM NAME BASED ON gameId
  io.to('room').emit('playerJoin', 'game.players.length');

  io.to('room').emit('endGame', 'the game is over');
});
