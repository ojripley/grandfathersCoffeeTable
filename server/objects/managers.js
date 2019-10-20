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
    this.players = players;
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [];
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

  constructor(players, fullDeck) {
    super(players, fullDeck);
  }

  deal() {
    if (this.players.length === 2) {
      console.log('dealing.....');

      for (let i = 0; i < 13; i++) {
        this.deck.moveCard(this.deck.cards[0], this.players[0].hand.cards);
        this.deck.moveCard(this.deck.cards[12 - i], this.players[1].hand.cards);
      }
    }
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

const p1 = new Player(1, 'name1');
const p2 = new Player(2, 'name2');

const game = new Goofspiel([p1, p2], fullDeck);
game.deal();


game.pendingMoves.push(p1.playCard(p1.hand.cards[0], game.table.cards));

console.log(`pending moves: ${game.pendingMoves[0].player.username}`);

game.pushPendingToHistory();

console.log(`pending moves: ${game.pendingMoves}`);
console.log(`past moves: ${game.moveHistory[0].player.username}`);



// console.log(`player hand: ${p1.hand.cards[0].value}`);
// console.log(`\n\n\n table: ${ game.table.cards[0].value }`);

// console.log('player one hand');
// console.log(p1.hand.cards);
// console.log('\n\n\nplayer two hand');
// console.log(p2.hand.cards);

// console.log(`deck ${game.deck.cards.length}`);




