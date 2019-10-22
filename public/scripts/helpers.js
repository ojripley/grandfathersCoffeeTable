//Gets username from cookie
const extractUserName = function(str) {
  return str.split("=")[0];
};

//Given an array of players, find the one that matches a given username
const findPlayer = function(players, username) {
  for (let player in players) {
    if (player.username = username) {
      return player;
    }
  }
  return undefined; //Username could not be found
}

//Finds a card object given the name of the card and an array of cards
const findCardByName = function(reqCard, cards) {
  for (let card in cards) {
    if (card.name === reqCard) {
      return card;
    }
  }
  return null;
}
