const { Player, Stack, Move, Goofspiel } = require('./entities');
const fullDeck = require('./fullDeck');

// constant objects (single instance entities only)
const activePlayers = {
  // add keys to this object as players login

  addPlayer(player) {
    this[player.id] = player;
  },
  removePlayer(player) {
    delete this[player.id];
  }
};

const activeGames = {

  idCount: 0,

  createNewGame(gametype) {
    switch (gametype) {
    case 'goofspiel':
      this.idCount++;
      return new Goofspiel('goof' + this.idCount, fullDeck);
    }
  },

  addGame(gametype) {
    let newGame = this.createNewGame(gametype);
    this[newGame.id] = newGame;

    return newGame;
  },

  removeGame(game) {
    delete this[game.id];
  }
};

module.exports = { activePlayers, activeGames };



//////////////////////////
// mock game test code! //
//////////////////////////


// players join server
// const p1 = new Player(1, 'name1');
// const p2 = new Player(2, 'name2');
// activePlayers.addPlayer(p1);
// activePlayers.addPlayer(p2);

// new game created
// activeGames.addGame('goofspiel');

// // players join game (will need to write a function for this)
// activeGames['1'].players.push(p1);
// activeGames['1'].players.push(p2);

// // game deals deck out to players
// activeGames['1'].deal();

// // player 1 plays a card
// // the card is moved from their hand to the table, and the move is logged into the pendingMoves array
// // player 2 does the same thing
// activeGames['1'].pendingMoves.push(activeGames['1'].players[0].playCard(activeGames['1'].players[0].hand.cards[0], activeGames['1'].table.cards));
// activeGames['1'].pendingMoves.push(activeGames['1'].players[1].playCard(activeGames['1'].players[0].hand.cards[0], activeGames['1'].table.cards));

// // the pending moves are then evaluated (need to write logic for nextState method)
// // activeGames['1'].nextState(pendingMoves);

// // moves are then pushed from pending to history
// activeGames['1'].pushPendingToHistory();

// // REPEAT UNTIL GAME IS OVER
// // isGameDone();

// // when game is finished, remove from activeGames
// activeGames.removeGame(activeGames['1']);

// // when players decide they are finished, they log out
// activePlayers.removePlayer(p1);
// activePlayers.removePlayer(p2);

// console.log(activePlayers);
// console.log(activeGames);
