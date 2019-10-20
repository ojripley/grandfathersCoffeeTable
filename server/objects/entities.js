

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

module.exports = {
  Player,
  Stack,
  Card,
  Move
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
