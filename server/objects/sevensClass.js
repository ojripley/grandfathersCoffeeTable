'use strict';

const Game = require('./gameClass');

class Sevens extends Game {

  constructor(id, fullDeck) {

    let tempFullDeck = fullDeck.slice(0);

    super(id, tempFullDeck);
    this.gameType = 'sevens';
    this.table.faceUp = true;
    this.turns = 0;
  }

  deal() {
    for (let card of this.deck.cards) {

      if (card.name === '7H') {
        card.playable = true;
      } else {
        card.playable = false;
      }
    }

    this.deck.moveCard(this.deck.cards[19], this.players[0].hand.cards);
    this.deck.moveCard(this.deck.cards[6], this.players[1].hand.cards);

    if (this.players.length === 2) {
      while (this.deck.cards.length > 0) {
        this.deck.moveCard(this.deck.selectRandom(), this.players[0].hand.cards);
        this.deck.moveCard(this.deck.selectRandom(), this.players[1].hand.cards);
      }
    }

    // first move goes to the player with the 7 of hearts
    this.currentPlayers = this.players.slice(0, 1);
  }

  score() {

    // assign scores
    this.players[0].score = 26 - this.players[0].hand.cards.length;
    this.players[1].score = 26 - this.players[1].hand.cards.length;

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

  isValidMove(move) {
    if (this.gameState === 'playing') {
      for (let pendingMove of this.pendingMoves) {
        if (move.player.username === pendingMove.player.username) {
          // can't have more than one pending move per player
          return false;
        }
      }

      if (this.currentPlayers.length !== 0) {
        if (move.player.username !== this.currentPlayers[0].username) {
          // not that players turn
          return false;
        }
      }

      if (move.card === null) {
        // if empty move, automatically valid. Point count will remain unchanged
        this.turns++;
        return true;
      }

      if (move.card.value === 7 && move.card.playable) {
        this.table.cards.splice(0, 0, move.card);
        this.turns++;

        return true;
      }

      // checks validity of a move against a card already on the table, inserts if valid
      for (let i = 0; i < this.table.cards.length; i++) {
        if (move.card.name[move.card.name.length - 1] === this.table.cards[i].name[this.table.cards[i].name.length - 1] && move.card.value === (this.table.cards[i].value + 1)) {

          // insert after
          this.table.cards.splice((i + 1), 0, move.card);
          this.turns++;

          return true;
        } else if (move.card.name[move.card.name.length - 1] === this.table.cards[i].name[this.table.cards[i].name.length - 1] && move.card.value === (this.table.cards[i].value - 1)) {

          // insert before
          this.table.cards.splice(i, 0, move.card);
          this.turns++;

          return true;
        }
      }
    }
    return false;
  }

  areAllMovesSubmitted() {
    if (this.pendingMoves.length === 1) {
      return true;
    }
    return false;
  }

  isGameDone() {

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
        if (this.turns % 2 === 0) {
          const position = this.players.map((player) => {
            return player.joinToken;
          }).indexOf(1);
          this.currentPlayers.push(this.players[position]);
        } else {
          // assign current players turn
          const position = this.players.map((player) => {
            return player.joinToken;
          }).indexOf(2);
          this.currentPlayers.push(this.players[position]);
        }


        // assign playable cards
        for (let playerCard of this.currentPlayers[0].hand.cards) {
          let alreadyPlayableFlag = false;
          for (let i = 0; i < this.table.cards.length; i++) {

            // if card is of same suit and value is higher by one
            if (playerCard.suit() === this.table.cards[i].name[this.table.cards[i].name.length - 1] && playerCard.value === (this.table.cards[i].value + 1)) {
              playerCard.playable = true;
              alreadyPlayableFlag = true;

              // if card is of same suit and value is lower by one
            } else if (playerCard.suit() === this.table.cards[i].name[this.table.cards[i].name.length - 1] && playerCard.value === (this.table.cards[i].value - 1)) {
              playerCard.playable = true;
              alreadyPlayableFlag = true;
            } else {

              // avoid assigning cards already assigned a playble state
              if (!alreadyPlayableFlag) {
                playerCard.playable = false;
              }
            }
          }

          // sevens are always playble after the first move
          if (playerCard.value === 7) {
            playerCard.playable = true;
          }
        }

        return false;
      }
    }
  }
}

module.exports = { Sevens };
