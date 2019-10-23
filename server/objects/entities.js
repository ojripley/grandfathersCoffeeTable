// 'use strict';

class Player {
  constructor(id, username, joinToken) {
    this.joinToken = joinToken;
    this.id = id;
    this.username = username;
    this.currentPosition = null;
    this.score = 0;
    this.hand = new Stack([]);
  }

  // playCard(card, table) {
  //   this.hand.moveCard(card, table.cards);

  //   return new Move(this, card);
  // }

  playCard(card, burntDeck) {
    const move = new Move(this, card);

    this.hand.moveCard(card, burntDeck.cards);

    return move;
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



module.exports = {
  Player,
  Stack,
  Card,
  Move
};
