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

    // used to notify all the players that is time to play a card
    this.currentPlayers = this.players.slice(0);
  }

  score() {
    const prize = this.table.cards[0];

    let highestBidValue = 0;
    let highestBiddingMoves = [];

    for (let move of this.pendingMoves) {

      if (move.card.value > highestBidValue) {
        highestBiddingMoves = [];
        highestBiddingMoves.push(move);
        highestBidValue = highestBiddingMoves[0].card.value;
      } else if (move.card.value === highestBidValue) {
        highestBiddingMoves.push(move);
      }
    }

    if (highestBiddingMoves.length === 1) {

      const playerToRecievePoints = this.players.filter(player => highestBiddingMoves[0].player.username === player.username);
      playerToRecievePoints[0].score += prize.value;
    }

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

    if (this.deck.cards.length === 0) {
      this.gameState = 'finished';
      return true;
    } else {

      // proceed with the game
      this.deck.moveCard(this.deck.selectRandom(), this.table.cards);

      // reset players who's turn it is (all players for goof)
      this.currentPlayers = this.players.slice(0);

      return false;
    }
  }
}

module.exports = { Goofspiel };
