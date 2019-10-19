class Stack {

  constructor(cards) {
    this.cards =  cards;
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

module.exports = {

  Stack,
  Card

};

// test drivers
// const card = new Card('2C', 2);
// console.log(card);

// const deck = new Stack([2, 3, 4]);
// const hand = new Stack([]);

// console.log(deck.cards);

// deck.moveCard(3, hand.cards);

// console.log(deck.cards);
// console.log(hand.cards);
