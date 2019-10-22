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








/////////////////////////////////////////
// !server side socket communications! //
/////////////////////////////////////////



io.on('connection', (client) => {
  console.log(`client connected: ${client}`);

  // emits are server -> client
  // ons are client -> server
  client.emit('msg', 'Hello from server');
  client.on('msg', (data) => {
    console.log(data);
  });

  // when a client requests to play a game
  client.on('requestGame', (data) => {

    console.log('requestGame data:', data);

    db.fetchProfile(data.username)
      .then(res => {
        // flag will be true when the player has beem added to a game
        let isInGame = false;
        // need to make a check for if game already exists
        // loop over all existing games
        for (let game in activeGames) {
          // if the current game matches the game type that the player wants
          if (game.substring(0, 4) === data.gametype.substring(0, 4)) {

            // if the game isn't full yet
            if (activeGames[game].players.length < 2 && !isInGame) {
              let isAlreadyParticipent = false;
              for (let player of activeGames[game].players) {
                console.log(`is ${data.username} ${player.username}`);
                if (player.username === data.username) {
                  isAlreadyParticipent = true;
                }
              }
              // if the player is not already part of that game
              if (!isAlreadyParticipent) {
                // add the player
                client.join(activeGames[game].id);
                console.log(`JOINING a game with the id: ${activeGames[game].id}`);
                activeGames[game].addPlayer(res[0].id, res[0].username);
                client.emit('newGame', { gameId: game, players: activeGames[game].players });
                isInGame = true;
                break;
              }
            }
          }
        }

        if (!isInGame) {
          // player wasn't added to an existing game and needs to be put into a new one
          const newGame = activeGames.addGame(data.gametype);
          console.log(`ADDING a new game with the id: ${newGame.id}`);
          client.join(newGame.id);
          newGame.addPlayer(res[0].id, res[0].username);
          client.emit('newGame', { gameId: newGame.id, players: newGame.players });
        }
      })
      .catch(error => {
        console.error(error);
      });
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
    console.log('requestHistory data:', data);

    db.fetchUserHistory(data)
      .then(res => {
        client.emit('history', res);
      });
  });

  client.on('requestMatchDetails', (data) => {
    console.log('requestMatchDetails data:', data);

    db.fetchMatchDetails(data)
      .then(res => {
        client.emit('matchDetails', res);
      });
  });

  client.on('requestLeaderBoard', (data) => {
    console.log('requestLeaderBoard data:', data);

    db.fetchLeaderBoard(data)
      .then(res => {
        client.emit('leaderBoard', res);
      });
  });

  // CHANGE ROOM TO DYNMAIC ROOM NAME BASED ON gameId
  io.to('room').emit('playerJoin', 'game.players.length');

  io.to('room').emit('endGame', 'the game is over');
});
