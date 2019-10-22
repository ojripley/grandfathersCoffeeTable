

class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.currentPosition = null;
    this.score = 0;
    this.hand = new Stack([]);
  }

  playCard(card, table) {
    this.hand.moveCard(card, table);

    return new Move(this, card);
  }
}

class Stack {

  constructor(cardsArray) {
    this.cards =  cardsArray;
    this.faceUp = false;
  }

  moveCard(card, destination) {
    destination.push(this.cards.splice(this.cards.indexOf(card), 1)[0]);
  }
}

class Card {

  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.img = `../../public/images/cards/PNG/${name}.png`;
    this.playable = true;
  }
}

class Move {
  constructor(player, card) {
    this.player = player;
    this.card = card;
  }
}

// abstract parent class for games
class Game {

  constructor(id, fullDeck) {
    if (new.target === Game) {
      throw new TypeError('Cannot construct an instance of an Abstract Class!');
    }
    // ----------------------------------------------------------------------------
    // attributes
    this.id = id;
    this.currentPlayer = null;
    this.players = [];
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [];
  }

  // ----------------------------------------------------------------------------
  // methods

  // adds new instance of a player to existing game
  addPlayer(id, username) {
    this.players.push(new Player(id, username));
  }

  // pushes each move object in pending to the history array
  // empties the pending move array
  pushPendingToHistory() {
    while (this.pendingMoves.length > 0) {
      this.moveHistory.push(this.pendingMoves.pop());
    }
  }
}

class Goofspiel extends Game {

  constructor(id, fullDeck) {
    super(id, fullDeck);
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


module.exports = {
  Player,
  Stack,
  Card,
  Move,
  Goofspiel
};

// test code
// const card = new Card('2C', 2);
// console.log(card);

// const deck = new Stack([2, 3, 4]);
// const hand = new Stack([]);

// console.log(deck.cards);

// deck.moveCard(3, hand.cards);

// console.log(deck.cards);
// console.log(hand.cards);
