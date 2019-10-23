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

    console.log(this.pendingMoves.length);
    if (this.pendingMoves.length === 2) {

      let roundWinner = null;

      if (this.pendingMoves[0].card.value > this.pendingMoves[1].card.value) {
        console.log('round winner is player 1');
        roundWinner = this.pendingMoves[0].player;
      } else if (this.pendingMoves[1].card.value > this.pendingMoves[0].card.value) {
        console.log('round winner is player 2');
        roundWinner = this.pendingMoves[1].player;
      } else {
        // if the round is a tie, the cards are added to the table as part of the next round's prize
        console.log('no winner!');
        this.pushPendingToTable();
        console.log(this.pendingMoves);
      }

      if (roundWinner) {

        // push cards into the winners hand and then log move to history
        while (this.pendingMoves.length > 0) {
          roundWinner.hand.cards.push(this.pendingMoves[0].card);
          this.moveHistory.push(this.pendingMoves.pop());
        }

        // player also takes all prize cards from previous rounds
        for (let card of this.table.cards) {
          this.table.moveCard(card, roundWinner.hand.cards);
        }
      }

      // assign scores
      this.players[0].score = this.players[0].hand.cards.length;
      this.players[1].score = this.players[1].hand.cards.length;

      // console.log('\nPLAYER SCORES:');
      // console.log(this.players[0].username + ': ' + this.players[0].score);
      // console.log(this.players[1].username + ': ' + this.players[1].score);
      // console.log();

      // sort players, highest score first
      for (let i = 0; i < this.players.length; i++) {
        for (let j = 1; j < this.players.length; j++) {
          if (this.players[j].score > this.players[i].score) {
            let temp = this.players[j];
            this.players[j] = this.players[i];
            this.players[i] = temp;
          }
        }
      }

      // assign positions
      for (let i = 0; i < this.players.length; i++) {
        this.players[i].currentPosition = (i + 1);
      }
    }
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
        this.players[0] = p2;
        this.players[1] = p1;
        this.gameState = 'finished';
        console.log('\nPLAYER SCORES:');
        console.log(this.players[0].username + ': ' + this.players[0].score);
        console.log(this.players[1].username + ': ' + this.players[1].score);
        console.log();
        return true;
      } else if (p2.hand.cards.length === 0) {
        this.players[0] = p1;
        this.players[1] = p2;
        this.gameState = 'finished';
        console.log('\nPLAYER SCORES:');
        console.log(this.players[0].username + ': ' + this.players[0].score);
        console.log(this.players[1].username + ': ' + this.players[1].score);
        console.log();
        return true;
      } else {
        console.log('\nPLAYER SCORES:');
        console.log(this.players[0].username + ': ' + this.players[0].score);
        console.log(this.players[1].username + ': ' + this.players[1].score);
        console.log();
        return false;
      }
    }
  }
}

module.exports = { Warr };
