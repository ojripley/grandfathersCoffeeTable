$(() => {
  window.myUsername = extractUserName(document.cookie);
  window.alertChain = $("#alert").toggle('slide');
  $("#alert").fadeTo(10, 1);

  $("#username").text(window.myUsername);
  //Nav bar logic:
  $('#menu-bars').on('click', () => {
    //$('#navbar').toggle('slide');
    $('#navbar').toggleClass('hidden', 500);
  });
  // new Promise();
  // window.socket = io.connect('172.46.3.253:8080');

  window.socket = io.connect('localhost:8080');

  $('#leaderboard').on('click', (event) => {
    socket.emit('requestLeaderBoard', 'goofspiel');
  });

  $(".select-game").on('click', (event) => {
    views_manager.show('goof');
  });
  $("#user-history-button").on('click', (event) => {
    socket.emit('requestHistory', myUsername);
  });

  $(".request-game").on('click', (event) => {
    let gametype = event.target.id;
    console.log(`requesting a new game of ${gametype}`);
    socket.emit('requestGame', { gametype, username: myUsername });
  });

  let player;
  socket.on('gameView', (data) => {
    console.log("RENDER THIS:");
    console.log(data); //Data contains all the info needed to render a screen

    //If the game hasn't started and we haven't seen this game before
    if (data.gameState === "pending" && !Object.keys(window.activeGames).includes(data.gameId)) {
      console.log("Creating a new game!")
      window.goofspiel.newGame(data.gameId);

      let gameName;
      switch (data.gameId.substring(0, 4)) {
        case 'goof':
          gameName = 'Goofspiel';
          break;
        case 'warr':
          gameName = 'War';
          break;
        case 'seve':
          gameName = 'Sevens';
          break;
        default:
          gameName = '';
          break;

      }
      //Append the game to the nav bar
      $("#game-list ul").append(`<li class="select-game" id="${data.gameId}">Game ${Object.keys(window.activeGames).length} - ${gameName} <span class="badge badge-pill badge-warning"></span>  </li>
      `);


      $(`#${data.gameId}`).on('click', (event) => {
        //User clicked on a particular game

        $(event.target).find('.badge').text(''); //Adds a badge for the user to know which games are waiting
        views_manager.show(data.gameId);
      });

      views_manager.show(data.gameId); //display the game immediately
    } else {
      if (window.curScreen === data.gameId) {
        //Currently on the game screen
        console.log('User is currently watching the game');
        views_manager.show(data.gameId, data);
      } else {

        //Not on the gamescreen --> just update the view but don't show it.
        goofspiel.updateView(window.activeGames[data.gameId].view, data);

        //Show  notification if user is supposed to make a move
        $("#alert").promise().done(() => {
          console.log("POP");
          //Is it the players turn?
          if (data.currentPlayers && userIsIn(data.currentPlayers, myUsername)) {
            let $alert = $("#alert");
            let $gameButton = $(`#${data.gameId}`);
            let gameName = $gameButton.text();
            $alert.on('click', (event) => {
              $gameButton.trigger('click');
            });
            $gameButton.find('.badge').text(' !');
            //$(`<span class="badge badge-pill badge-warning">  !</span> `).appendTo($(`#${data.gameId}`));

            $alert.find(".card-body").text(`A move has been played in ${gameName}. `);
            $alert.toggle('slide', 1000, () => {
              setTimeout(() => $alert.toggle('slide', 1000), 1000);
            })
          }
        });
      }
    }

  });

  /*
    socket.on('join', (data) => { //not used
      console.log("PLAYER HAS JOINED");
      //goofspiel.updateView(window.activeGames[data.gameId].view, data);

      console.log(data);
      //Update the progress bar
    });
    */

  socket.on('leaderBoard', (data) => {
    //show highscores (move this to the response of leaderboard)
    views_manager.show('leaderboard', data);

  });




  socket.emit('msg', "hi there");
  socket.on('endGame', (data) => {
    console.log('This is the end of game data (leaderboard)');
    console.log(data);
  });


  socket.on('history', (data) => {
    console.log('Here is the history');
    console.log(data);
    if (data[0]) {
      profile.updateMatchHistoryTable(data);
      socket.emit('requestMatchDetails', data[0].id);
    } else {
      //This will only happen when user searches someone that doesnt' exist OR first time user
      let histMessage = $("#historyErrorMessage");
      if (histMessage) {
        console.log("Hello");
        profile.updateMatchHistoryTable(data);
        $("#historyErrorMessage").text("User does not exist");
      } else {
        console.log("trying to render");
        profile.updateMatchHistoryTable(data);

      }
    }
  });

  //socket.emit('requestMatchDetails', 1);

  socket.on('matchDetails', (data) => {
    console.log('Here are the match details');
    console.log(data);
    profile.updateMatchSpecificTable(data);

    views_manager.show('profile');
  })

  socket.on('msg', (data) => {
    console.log(data);
  });
  socket.on('connection', (data) => {
    console.log(data);
  })

});



