const { activeGames } = require('./managers');

activeGames.addGame('warr');

console.log(activeGames);

activeGames['warr1'].addPlayer(1, 'player1', 1);
activeGames['warr1'].addPlayer(2, 'player2', 2);

activeGames['warr1'].start();
activeGames['warr1'].deal();

console.log('\n\n\nplayer one hand: \n');
console.log(activeGames['warr1'].players[0].hand.cards);
console.log('\n\n\nplayer two hand: \n');
console.log(activeGames['warr1'].players[1].hand.cards);

activeGames['warr1'].pendingMoves.push(activeGames['warr1'].players[0].playCard(activeGames['warr1'].players[0].hand.selectRandom(), activeGames['warr1'].burntDeck));
activeGames['warr1'].pendingMoves.push(activeGames['warr1'].players[1].playCard(activeGames['warr1'].players[1].hand.selectRandom(), activeGames['warr1'].burntDeck));

console.log('\n\nmoves to be scored:\n');
console.log(activeGames['warr1'].pendingMoves);

if (activeGames['warr1'].areAllMovesSubmitted()) {
  activeGames['warr1'].score();
  activeGames['warr1'].isGameDone();
}

let turns = 1;
while (!activeGames['warr1'].isGameDone()) {
  console.log('\n\nthere should be no moves to be scored:\n');
  console.log(activeGames['warr1'].pendingMoves[0]);
  console.log(activeGames['warr1'].pendingMoves[1]);

  activeGames['warr1'].pendingMoves.push(activeGames['warr1'].players[0].playCard(activeGames['warr1'].players[0].hand.selectRandom(), activeGames['warr1'].burntDeck));
  activeGames['warr1'].pendingMoves.push(activeGames['warr1'].players[1].playCard(activeGames['warr1'].players[1].hand.selectRandom(), activeGames['warr1'].burntDeck));


  turns++;
  console.log('\n\n turn total: ', turns);

  console.log('\n\nmoves to be scored:\n');
  console.log(activeGames['warr1'].pendingMoves[0].card);
  console.log(activeGames['warr1'].pendingMoves[1].card);

  if (activeGames['warr1'].areAllMovesSubmitted()) {
    activeGames['warr1'].score();
  }

}



