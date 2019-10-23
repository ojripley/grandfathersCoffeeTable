const { Goofspiel } = require('./goofspielClass');
const { Warr } = require('./warrObject');
const fullDeck = require('./fullDeck');

// constant objects (single instance entities only)
const activePlayers = {
  // add keys to this object as players login

  addPlayer(player) {
    this[player.id] = player;
  },
  removePlayer(player) {
    delete this[player.id];
  }
};

const activeGames = {

  idCount: 0,

  createNewGame(gametype) {
    switch (gametype) {
    case 'goofspiel':
      this.idCount++;
      return new Goofspiel('goof' + this.idCount, fullDeck);
    case 'warr':
      this.idCount++;
      return new Warr('warr' + this.idCount, fullDeck);
    }
  },

  addGame(gametype) {
    let newGame = this.createNewGame(gametype);
    this[newGame.id] = newGame;

    return newGame;
  },

  removeGame(game) {
    delete this[game.id];
  }
};

module.exports = { activePlayers, activeGames };
