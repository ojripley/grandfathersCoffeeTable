'use strict';

const Game = require('./gameClass');

class Warr extends Game {

  constructor(id, fullDeck) {

    let tempFullDeck = fullDeck.slice(0);

    super(id, tempFullDeck);
    this.gameType = 'warr';
    this.table.faceUp = true;
  }

  deal() {
    console.log('\n\ndealing.....');

    if (this.players.length === 2) {
      this.players[0].hand.cards = this.deck.cards.splice(0, 26);
      this.players[1].hand.cards = this.deck.cards.splice(0, 26);
    }
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

      playerToRecievePoints[0].score += (highestBidValue + prize.value);
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

    // this.players.indexOf[this.players[i]]

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

    if (this.players.length === 2) {

      const p1 = this.players[0];
      const p2 = this.players[1];

      if (p1.hand.cards.length === 0) {
        this.players[0] = p1;
        this.players[1] = p2;
        this.gameState = 'finished';
        return true;
      } else if (p2.hand.cards.length === 0) {
        this.players[0] = p2;
        this.players[1] = p1;
        this.gameState = 'finished';
        return true;
      } else {
        return false;
      }
    }
  }
}

module.exports = { Warr };
