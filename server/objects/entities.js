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

  selectRandom() {
    console.log(this);
    return this.cards[Math.floor(Math.random() * Math.floor(this.cards.length))];
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
    this.table.faceUp = true;
  }

  deal() {
    console.log('dealing.....');

    for (let i = 0; i < 13; i++) {
      this.deck.moveCard(this.deck.cards[0], this.players[0].hand.cards);
      this.deck.moveCard(this.deck.cards[12 - i], this.players[1].hand.cards);
      if (this.players.length === 3) {
        this.deck.moveCard(this.deck.cards[24 - i], this.players[2].hand.cards);
      } else {
        this.deck.moveCard(this.deck.cards[24 - i], this.burntDeck.cards);
      }
    }

    // first card is placed on the table
    // this kicks off the the game
    this.deck.moveCard(this.deck.selectRandom(), this.table.cards);
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
