const extractUserName = function(str) {

  return str.split("=")[0];

};

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


  // $('.card').on('click', (event) => {
  //   // let $chosenCard = $(event.target);
  //   let cardName = event.target.id;
  //   console.log(cardName);
  //   // console.log($chosenCard.attr("id"));
  //   console.log('click');
  //   //Makes a move if it is the player's turn

  // });


  let socket = io.connect('172.46.3.253:8080');

  $('#high-scores').on('click', (event) => {
    console.log("requesting the high scores");
    socket.emit('requestLeaderBoard', 'goofspiel');
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
    player = data.player[0];
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

  //When a card is clicked call this:
  $("#AD").on('click', (event) => {
    console.log('uh');
    socket.emit('move', 'hello'); //Send the client's player object
    /*
{
      Player: player,
      Card: player.hand.cards[0]
    }

    */
  });

  socket.emit('msg', "hi there");
  socket.on('endGame', (data) => {
    console.log('This is the end of game data (leaderboard)');
    console.log(data);
  });

  // socket.on('requestHistory'){

  // }
  //onMove send game id


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



