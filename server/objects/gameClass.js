const { Player, Stack } = require('./entities');

// abstract parent class for games
module.exports = class Game {

  constructor(id, fullDeck) {
    if (new.target === Game) {
      throw new TypeError('Cannot construct an instance of an Abstract Class!');
    }

    // attributes
    this.id = id;
    this.gameType = null;
    this.currentPlayers = [];
    this.players = [];
    this.gameState = 'pending';
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [];
  }

  // methods

  // sets the game state to playable
  start() {
    this.gameState = 'playing';
  }

  // adds new instance of a player to existing game
  addPlayer(id, username, joinToken) {
    this.players.push(new Player(id, username, joinToken));
  }

  // pushes each move object in pending to the history array
  // empties the pending move array
  pushPendingToHistory() {
    while (this.pendingMoves.length > 0) {
      this.moveHistory.push(this.pendingMoves.pop());
    }
  }

  pushPendingToTable() {

    this.pendingMoves.forEach(move => {
      this.table.cards.push(move.card);
    });
  }
};
