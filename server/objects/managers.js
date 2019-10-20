const { Player, Stack, Move } = require('./entities');
const fullDeck = require('./fullDeck');


// abstract parent class for games
class Game {

  constructor(players, fullDeck) {
    if (new.target === Game) {
      throw new TypeError('Cannot construct an instance of an Abstract Class!');
    }
    // ----------------------------------------------------------------------------
    // attributes
    this.activePlayer = null;
    this.players = [];
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [1, 2];
  }


  // ----------------------------------------------------------------------------
  // methods

  // pushes each move object in pending to the history array
  // empties the pending move array
  pushPendingToHistory() {
    while (this.pendingMoves.length > 0) {
      this.moveHistory.push(this.pendingMoves.pop());
    }
  }
}


class Goofspiel extends Game {

  constructor() {
    super(fullDeck);
  }

  deal() {

  }

  score() {

  }

  isMoveValid() {

  }

  nextState(pendingMoves) {

  }

  isGameDone() {

  }
}


// testing code
const game = new Goofspiel(fullDeck);

console.log(`pending moves: ${game.pendingMoves}`);

game.pushPendingToHistory();

console.log(`pending moves: ${game.pendingMoves}`);
console.log(`past moves: ${game.moveHistory}`);

console.log(game.deal());
