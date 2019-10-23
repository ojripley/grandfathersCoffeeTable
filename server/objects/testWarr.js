const { activeGames } = require('./managers');

activeGames.addGame('warr');

console.log(activeGames);

activeGames['warr1'].addPlayer(1, 'player1');
activeGames['warr1'].addPlayer(2, 'player2');

activeGames['warr1'].start();
activeGames['warr1'].deal();

console.log('\n\n\nplayer one hand: \n');
console.log(activeGames['warr1'].players[0].hand.cards);
console.log('\n\n\nplayer two hand: \n');
console.log(activeGames['warr1'].players[1].hand.cards);
