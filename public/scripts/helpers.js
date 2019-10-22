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
