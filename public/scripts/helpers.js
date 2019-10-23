//Gets username from cookie
const extractUserName = function(str) {
  return str.split("=")[0];
};

//Given an array of players, order them as player 1,2,3,4. Player 1 is always the current player. Other players are based on their tokens
const findPlayer = function(players, username) {
  let retArr;

  console.log("these are the players");
  console.log(players);
  console.log("looking for");
  console.log(username);
  const flag = false;
  for (let player of players) {

    if (player.username === username) {
      //retArr.push player;
      return player;
    }
  }
  return undefined; //Username could not be found
}

//Finds a card object given the name of the card and an array of cards
const findCardByName = function(reqCard, cards) {
  for (let card of cards) {
    if (card.name === reqCard) {
      return card;
    }
  }
  return null;
}
