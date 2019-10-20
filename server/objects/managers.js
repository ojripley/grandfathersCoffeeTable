const { Stack } = require('./entities');
const fullDeck = require('./fullDeck');

class Game {

  constructor(fullDeck) {
    this.activePlayer = null;
    this.players = [];
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [1, 2];
  }

  movePendingToHistory() {
    while (this.pendingMoves.length > 0) {
      this.moveHistory.push(this.pendingMoves.pop());
    }
  }


}




// testing code
const game = new Game(fullDeck);

console.log(`pending moves: ${game.pendingMoves}`);

game.movePendingToHistory();

console.log(`pending moves: ${game.pendingMoves}`);
console.log(`past moves: ${game.moveHistory}`);
