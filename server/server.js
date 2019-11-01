// load .env data into process.env
require('dotenv').config();

// server config
const PORT = process.env.PORT || 8080;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const morgan = require('morgan');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cookieParser = require('cookie-session');

// this is the object used to manage all running games on the server
const { activeGames, activePlayers } = require('./objects/managers.js');

// db related operations
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

// page routes
const loginRoutes = require('../routes/loginRoutes');
const registerRoutes = require('../routes/registerRoutes');
const logoutRoutes = require('../routes/logoutRoutes');

// mount above query routes to db
app.use('/', loginRoutes(db));
app.use('/', registerRoutes(db));
app.use('/', logoutRoutes());

// Home page
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


const broadcastGame = function(io, game) {
  io.to(game).emit('gameView', {
    gameState: activeGames[game].gameState,
    currentPlayers: activeGames[game].currentPlayers,
    players: activeGames[game].players,
    table: activeGames[game].table,
    pendingMoves: activeGames[game].pendingMoves,
    deck: activeGames[game].deck,
    gameId: game,
  });
};


io.on('connection', (client) => {
  client.emit('msg', 'Server - Connected');
  console.log(`client connected`);
  client.on('msg', (data) => {
    console.log(data);
  });

  client.on('username', (data) => {
    const username = data;
    console.log(username +  ' has logged in');

    // player added to list of active players
    activePlayers.addPlayer(client, username);

    // check if that player is a participant in any active games
    for (let game in activeGames) {
      if (activeGames[game].gameType) {
        console.log(activeGames[game]);
        for (let player of activeGames[game].players) {
          console.log(player);
          console.log(`\n\nchecking game ${game} with player: ${player.username}`);
          if (player.username === username) {
            console.log(`${username} is part of game ${game}`);

            // put them back in the room
            client.join(game);

            // broadcast the game so that the client gets it
            broadcastGame(io, game);
          }
        }
      }
    }

    client.on('disconnect', () => {
      activePlayers.removePlayer(username);
    });
  });

  // client requests to play a game event
  client.on('requestGame', (data) => {

    console.log('requestGame data:', data);

    db.fetchProfile(data.username)
      .then(res => {

        // flag will be true when the player has beem added to a game
        let isInGame = false;

        // loop over all existing games
        for (let game in activeGames) {

          // if the current game matches the game type that the player wants
          if (game.substring(0, 4) === data.gametype.substring(0, 4)) {

            // if the game isn't full yet
            if (activeGames[game].players.length < 2 && !isInGame) {
              let isAlreadyParticipent = false;
              for (let player of activeGames[game].players) {
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

                // send game details to room
                broadcastGame(io, game);
                io.to(game).emit('join', { gameId: game, numberOfPlayers: activeGames[game].players.length });

                isInGame = true;

                // in future version, would like to make a socket event for this if a client wants to start a game manually
                activeGames[game].start();

                // show the game to clients
                if (activeGames[game].gameState === 'playing') {
                  broadcastGame(io, game);

                  // deal cards and show game again
                  setTimeout(() => {
                    activeGames[game].deal();

                    // send game details to room
                    broadcastGame(io, game);
                  }, 2000);




                  setTimeout(() => {
                    if (activeGames[game]) {
                      delete activeGames[game];
                    }
                  }, 3600000);
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

          // send game details to room
          broadcastGame(io, newGame.id);

          io.to(newGame.id).emit('join', { gameId: newGame.id, numberOfPlayers: newGame.players.length });


          // if no opponent match is found after 3 minutes, delete the game from server memory
          setTimeout(() => {
            if (newGame.gameState === 'pending') {
              io.to(newGame).emit('resultsView', { gameId: newGame, players: newGame.players });
              delete activeGames[newGame.id];
            }
          }, 300000);
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
      const playerPositionInCurrentPlayers = activeGames[game].currentPlayers.map((player) => {
        return player.username;
      }).indexOf(move.player.username);

      const player = activeGames[game].players.filter(player => player.username === move.player.username);

      if (move.card) {
        for (let card of player[0].hand.cards) {
          if (move.card.name === card.name) {
            player[0].hand.cards.splice(player[0].hand.cards.indexOf(card), 1);
          }
        }
      }

      // remove player from currentPlayers for turn
      activeGames[game].currentPlayers.splice(playerPositionInCurrentPlayers, 1);

      // add to the array of moves to be evaluated
      activeGames[game].pendingMoves.push(move);

      // broadcast the game to all players
      broadcastGame(io, game);

      // if the required moves for the round have all been submitted
      if (activeGames[game].areAllMovesSubmitted()) {
        setTimeout(() => {

          // evaluate the move scores and push moves to history
          activeGames[game].score();

          activeGames[game].pushPendingToHistory();

          // broadcast the game to all players
          broadcastGame(io, game);

          // evaluate if game and case has been reached
          if (activeGames[game].isGameDone()) {

            // broadcast the game to all players
            broadcastGame(io, game);

            setTimeout(() => {

              // show results view to players
              io.to(game).emit('resultsView', { gameId: game, players: activeGames[game].players });

              // write results to database
              db.addMatch(activeGames[game].gameType)
                .then(res => {
                  let matchId = res[0].id;
                  for (let player of activeGames[game].players) {
                    db.addResult(matchId, player)
                      .then(() => {
                        console.log('DB insertion for game: ', game);

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
            }, 1000);
          } else {
            // broadcast the game to all players
            broadcastGame(io, game);
          }
        }, 2000);
      }
    }
  });

  // .on events for db query requests

  // user match history
  client.on('requestHistory', (data) => {
    console.log('requestHistory data:', data);

    db.fetchUserHistory(data)
      .then(res => {
        client.emit('history', res);
      });
  });

  // individual match details
  client.on('requestMatchDetails', (data) => {
    console.log('requestMatchDetails data:', data);

    db.fetchMatchDetails(data)
      .then(res => {
        client.emit('matchDetails', res);
      });
  });

  // gametype leaderboard
  client.on('requestLeaderBoard', (data) => {
    console.log('requestLeaderBoard data:', data);

    db.fetchLeaderBoard(data)
      .then(res => {
        client.emit('leaderBoard', res);
      });
  });
});
