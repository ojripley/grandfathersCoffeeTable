class Player {
  constructor(id, username) {
    this.id = id;
    this.username = username;
    this.currentPosition = null;
    this.score = 0;
    this.hand = new Stack([]);
  }

  playCard(card, table) {
    this.hand.moveCard(card, table.cards);

    return new Move(this, card);
  }
}

class Stack {

  constructor(cardsArray) {
    this.cards =  cardsArray;
    this.faceUp = false;
  }

  moveCard(card, destination) {
    // console.log(card);
    // console.log(this.cards.indexOf(card));
    destination.push(this.cards.splice(this.cards.indexOf(card), 1)[0]);
    // destination.push(this.cards.splice(this.cards.filter((cardToRemove, index) => {
    //   if (cardToRemove.name === card.name) {
    //     console.log(index);
    //     return index;
    //   }
    // }), 1)[0]);
  }

  selectRandom() {
    // console.log('\nthe deck:\n');
    // console.log(this);
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
    this.gameType = null;
    this.currentPlayer = null;
    this.players = [];
    this.gameState = 'pending';
    this.table = new Stack([]);
    this.deck = new Stack(fullDeck);
    this.burntDeck = new Stack([]);
    this.moveHistory = [];
    this.pendingMoves = [];
  }

  // ----------------------------------------------------------------------------
  // methods

  // sets the game state to playable
  start() {
    this.gameState = 'playing';
  }

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
    this.gameType = 'goofspiel';
    this.table.faceUp = true;
  }

  deal() {
    console.log('dealing.....');

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

      console.log(playerToRecievePoints);
      // highestBiddingMoves[0].player.score += (highestBidValue + prize.value);
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

  isValidMove() {
    if (this.gameState === 'playing') {
      console.log('moves are valid\n\n');
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

      return false;
    }
  }
}

module.exports = {
  Player,
  Stack,
  Card,
  Move,
  Goofspiel
};
