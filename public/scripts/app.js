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

$(() => {
  const myUsername = extractUserName(document.cookie);

  console.log(document.cookie);
  //Nav bar logic:
  $('#menu-bars').on('click', (event) => {

    $('#navbar').toggleClass('hidden', 500);
  });


  $(function() {
    $("#2C").draggable();
  });




  //let socket = io.connect('172.46.3.253:8080');

  //Temporary
  let socket = io.connect('192.168.43.107:8080');

  $('#high-scores').on('click', (event) => {
    //Load highscores
    console.log("requesting the high scores");
    socket.emit('requestLeaderBoard', 'goofspiel');
    views_manager.show('leaderboard');
  });

  $("#goo12").on('click', (event) => {
    console.log('click');
    socket.emit('requestGame', { gametype: 'goofspiel', username: myUsername });
  });


  $("#war12").on('click', (event) => {
    console.log('click');
    socket.emit('requestGame', { gametype: 'war', username: myUsername });
  });

  $("#sev12").on('click', (event) => {
    console.log('click');

    socket.emit('requestGame', { gametype: 'sevens', username: myUsername });
  });


  let player;
  socket.on('gameView', (data) => {
    console.log("RENDER THIS:");

    console.log(data); //Store the view based on the data provided
    console.log('Player:')
    console.log(data.player); //Array of players
    player = findPlayer(data.player);
    console.log('Table');
    console.log(data.table);
    console.log('opponents');
    console.log(data.opponents);
    console.log('Table');
    console.log(data.table);
    console.log('Gameid');
    console.log(data.gameid);
    console.log('Current Player id');
    console.log(data.curPlayerId);
  });

  socket.on('newGame', (data) => {
    console.log("ADD THIS NEW GAME");
    console.log(data);

  });

  socket.on('playerJoin', (data) => {
    console.log("PLAYER HAS JOINED");
    console.log(data);
  });

  socket.on('leaderBoard', (data) => {
    console.log("Here is the leaderboard");
    console.log(data);
  });


  $('.card').on('click', (event) => {
    // let $chosenCard = $(event.target);
    let cardName = event.target.id;
    console.log(cardName);
    console.log('click');
    socket.emit('move', 'hello'); //Send the client's player object & card

  });

  socket.emit('msg', "hi there");
  socket.on('endGame', (data) => {
    console.log('This is the end of game data (leaderboard)');
    console.log(data);
  });

  socket.emit('requestHistory', myUsername);
  socket.on('history', (data) => {
    console.log('Here is the history');
    console.log(data);
  });

  socket.emit('requestMatchDetails', 1);

  socket.on('matchDetails', (data) => {
    console.log('Here are the match details');
    console.log(data);
  })

  socket.on('msg', (data) => {
    console.log(data);
  });
  socket.on('connection', (data) => {
    console.log(data);
  })

});



