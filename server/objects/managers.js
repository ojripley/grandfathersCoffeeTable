const { Goofspiel } = require('./goofspielClass');
const { Warr } = require('./warrClass');
const { Sevens } = require('./sevensClass');
const fullDeck = require('./fullDeck');

// constant objects (single instance entities only)


/* NOTE:
activePlayers is not currently used, however in future versions
we would like to use this object to keep track of connected players in server.js
this would allow us to map a player to an active game, and upon unexpected disconnect,
insert players back into to their unfinished games when they reconnect */
const activePlayers = {
  // add keys to this object as players login

  addPlayer(player) {
    this[player.id] = player;
  },
  removePlayer(player) {
    delete this[player.id];
  }
};

// each key in this object (that is not a method) will be a game instance
// key's are added as new games are generated
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
    case 'sevens':
      this.idCount++;
      return new Sevens('seve' + this.idCount, fullDeck);
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
