'use strict';

const Game = require('./gameClass');

class Goofspiel extends Game {

  constructor(id, fullDeck) {

    let tempFullDeck = fullDeck.slice(0);

    super(id, tempFullDeck);
    this.gameType = 'goofspiel';
    this.table.faceUp = true;
  }

  deal() {
    console.log('\n\ndealing.....');

    console.log(this.deck);
    console.log();

    for (let i = 0; i < 13; i++) {
      this.deck.moveCard(this.deck.cards[0], this.players[0].hand.cards);
      this.deck.moveCard(this.deck.cards[12 - i], this.players[1].hand.cards);
      if (this.players.length === 3) {
        this.deck.moveCard(this.deck.cards[24 - (i * 2)], this.players[2].hand.cards);
      } else {
        this.deck.moveCard(this.deck.cards[24 - (i * 2)], this.burntDeck.cards);
      }
    }

    // first card is placed on the table
    // this kicks off the the game
    this.deck.moveCard(this.deck.selectRandom(), this.table.cards);
  }

  score() {
    const prize = this.table.cards[0];

    console.log(`the prize is ${prize.value}\n\n`);

    let highestBidValue = 0;
    let highestBiddingMoves = [];

    for (let move of this.pendingMoves) {

      console.log(`the current evaluated move is ${move.card.value}\n\n`);

      if (move.card.value > highestBidValue) {
        highestBiddingMoves = [];
        highestBiddingMoves.push(move);
        highestBidValue = highestBiddingMoves[0].card.value;
      } else if (move.card.value === highestBidValue) {
        highestBiddingMoves.push(move);
      }
    }

    console.log(`the highest bid is ${highestBidValue}\n\n`);

    if (highestBiddingMoves.length === 1) {

      const playerToRecievePoints = this.players.filter(player => highestBiddingMoves[0].player.username === player.username);

      playerToRecievePoints[0].score += prize.value;
    }


    console.log('\nPLAYER SCORES:');
    console.log(this.players[0].username + ': ' + this.players[0].score);
    console.log(this.players[1].username + ': ' + this.players[1].score);
    console.log();

    for (let i = 0; i < this.players.length; i++) {
      for (let j = 1; j < this.players.length; j++) {
        if (this.players[j].score > this.players[i].score) {
          let temp = this.players[j];
          this.players[j] = this.players[i];
          this.players[i] = temp;
        }
      }
    }

    for (let i = 0; i < this.players.length; i++) {
      this.players[i].currentPosition = (i + 1);
    }

    this.table.cards.pop();

  }

  isValidMove(move) {
    if (this.gameState === 'playing') {
      for (let pendingMove of this.pendingMoves) {
        if (move.player.username === pendingMove.player.username) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  areAllMovesSubmitted() {
    if (this.pendingMoves.length === this.players.length) {
      return true;
    }

    return false;
  }

  isGameDone() {

    console.log('\n\n\n\n' + this.gameState + '\n\n\n\n');

    if (this.deck.cards.length === 0) {
      this.gameState === 'finished';
      console.log(`\n the winner is... ${this.players[0].username} \n\n`);
      return true;
    } else {

      // proceed with the game
      this.deck.moveCard(this.deck.selectRandom(), this.table.cards);

      this.currentPlayers = this.players;

      return false;
    }
  }
}

module.exports = { Goofspiel };
