const { Stack, Card } = require('./entities');
const fullDeck = require('./fullDeck');

class Game {

  constructor() {
    this.activePlayer = null;
    this.players = [];
    this.table = new Stack([]);
    this.deck = new Stack([]);
    this.burntDeck = new Stack([]);
  }
}

console.log(fullDeck);
