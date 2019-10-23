// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT = process.env.PORT || 8080;
// const ENV        = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
// const sass       = require("node-sass-middleware");
const app = express();
const morgan = require('morgan');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-session');
const { activeGames } = require('./objects/managers.js');

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
    res.render('login', { loginAttempt: true });
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
  // client.on('msg', (data) => {
  //   console.log(data);
  // });

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
                activeGames[game].addPlayer(res[0].id, res[0].username, (activeGames[game].players.length + 1));

                // send game details to client, and player join status to room
                client.emit('newGame', { gameId: game, players: activeGames[game].players });
                io.to(game).emit('join', { gameId: game, numberOfPlayers: activeGames[game].players.length });

                isInGame = true;

                console.log(activeGames);
                console.log(activeGames[game].deck.cards.length);

                // we can make a socket event for this if a client wants to start a game manually
                activeGames[game].start();

                // show the game to clients
                if (activeGames[game].gameState === 'playing') {
                  io.to(game).emit('gameView', {
                    players: activeGames[game].players,
                    table: activeGames[game].table,
                    pendingMoves: activeGames[game].pendingMoves,
                    deck: activeGames[game].deck,
                    gameId: game,
                  });

                  // deal cards and show game again
                  setTimeout(() => {
                    activeGames[game].deal();
                    console.log('\n\nsending dealt game to players....\n\n');
                    io.to(game).emit('gameView', {
                      players: activeGames[game].players,
                      table: activeGames[game].table,
                      pendingMoves: activeGames[game].pendingMoves,
                      deck: activeGames[game].deck,
                      gameId: game,
                    });
                  }, 2000);
                }
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
          newGame.addPlayer(res[0].id, res[0].username, (newGame.players.length + 1));

          // send game details to client, and player join status to room
          client.emit('newGame', { gameId: newGame.id, players: newGame.players });
          io.to(newGame.id).emit('join', { gameId: newGame, numberOfPlayers: newGame.players.length });
        }
      })
      .catch(error => {
        console.error(error);
      });
  });


  client.on('move', (data) => {
    console.log('recieving move:');
    console.log(data);

    const game = data.gameId;
    let move = data.move;

    if (activeGames[game].isValidMove(move)) {
      // add the submitted move to pending

      const player = activeGames[game].players.filter(player => player.username === move.player.username);

      for (let card of player[0].hand.cards) {
        if (move.card.name === card.name) {
          player[0].hand.cards.splice(player[0].hand.cards.indexOf(card), 1);
        }
      }

      activeGames[game].pendingMoves.push(move);

      // broadcast the game to all players
      io.to(game).emit('gameView', {
        players: activeGames[game].players,
        table: activeGames[game].table,
        pendingMoves: activeGames[game].pendingMoves,
        deck: activeGames[game].deck,
        gameId: game,
      });

      // if the required moves for the round have all been submitted
      if (activeGames[game].areAllMovesSubmitted()) {

        console.log('\nmoves have been submitted\n');

        setTimeout(() => {
          // evaluate the move scores and push moves to history
          activeGames[game].score();
          activeGames[game].pushPendingToHistory();

          // broadcast the game to all players
          io.to(game).emit('gameView', {
            players: activeGames[game].players,
            table: activeGames[game].table,
            pendingMoves: activeGames[game].pendingMoves,
            deck: activeGames[game].deck,
            gameId: game,
          });

          console.log('\n\nplayer one hand:\n');
          console.log(activeGames[game].players[0].hand.cards);

          // evaluate if game and case has been reached
          if (activeGames[game].isGameDone()) {

            // broadcast the game to all players
            io.to(game).emit('gameView', {
              players: activeGames[game].players,
              table: activeGames[game].table,
              pendingMoves: activeGames[game].pendingMoves,
              deck: activeGames[game].deck,
              gameId: game,
            });

            setTimeout(() => {
              // show results view to players
              io.to(game).emit('resultsView', { gameId: game, players: activeGames[game].players });

              // write results to database
              db.addMatch(activeGames[game].gameType)
                .then(res => {
                  console.log(res);
                  let matchId = res[0].id;
                  for (let player of activeGames[game].players) {
                    db.addResult(matchId, player)
                      .then(() => {
                        console.log('added match and result rows of game ', game);
                        // remove game from server memory
                        delete activeGames[game];
                      })
                      .catch(error => {
                        console.error(error);
                      });
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }, 2000);
          } else {
            // broadcast the game to all players
            io.to(game).emit('gameView', {
              players: activeGames[game].players,
              table: activeGames[game].table,
              pendingMoves: activeGames[game].pendingMoves,
              deck: activeGames[game].deck,
              gameId: game,
            });
          }
        }, 2000);
      }
    }
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
