$(() => {
  //This is the username that will be passed between server and client.
  //In future versions this should be a token instead that maps to a username on server-side
  window.myUsername = extractUserName(document.cookie);

  window.alertChain = $("#alert").toggle('slide');
  $("#alert").fadeTo(10, 1);
  $("#username").text(window.myUsername);//Sets the username in the nav bar

  //Nav bar logic:
  $('#menu-bars').on('click', () => {
    //Hides nav bar. But this class only affects mobile view.
    $('#navbar').toggleClass('hidden', 500);
  });

  // window.socket = io.connect('172.46.3.253:8080');
  // window.socket = io.connect('localhost:8080');
  window.socket = io();
  // window.socket = io.connect('172.46.3.232:8080');

  /*
  Buttons being set so that user can request information from the server
  */

  $('#leaderboard').on('click', (event) => {
    socket.emit('requestLeaderBoard', 'goofspiel');
  });

  $(".select-game").on('click', (event) => {
    views_manager.show('goof'); //The goof screen is the default screen that contains the loading bar.
  });

  $("#user-history-button").on('click', (event) => {
    socket.emit('requestHistory', myUsername);
  });

  $(".request-game").on('click', (event) => {
    let gametype = event.target.id;
    socket.emit('requestGame', { gametype, username: myUsername });
  });

  //This is the main communication with the server for games. The client will display the data coming from the server (or store it in memory if the user is not watching the screen)s.
  socket.on('gameView', (data) => {
    /* This is a useful console log to see what is being passed back and forth between the server and client
    console.log("RENDER THIS:");
    console.log(data); //Data contains all the info needed to render a screen
    */

    //If the game hasn't started and we haven't seen this game before
    if (data.gameState === "pending" && !Object.keys(window.activeGames).includes(data.gameId)) {
      if (data.gameId.indexOf("goof") !== -1) {
        window.goofspiel.newGame(data.gameId);
      }
      if (data.gameId.indexOf("seve") !== -1) {
        window.sevens.newGame(data.gameId);
      }
      if (data.gameId.indexOf("war") !== -1) {
        window.war.newGame(data.gameId);
      }
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
      $("#game-list ul").append(`<li class="select-game" id="${data.gameId}">Game ${Object.keys(window.activeGames).length} - ${gameName} <span class="badge badge-pill badge-warning"></span>  </li>`);


      $(`#${data.gameId}`).on('click', (event) => {
        //User clicked on a particular game
        $(event.target).find('.badge').text(''); //Adds a badge for the user to know which games are waiting
        views_manager.show(data.gameId);
      });

      views_manager.show(data.gameId); //display the game immediately
    } else {
      if (window.curScreen === data.gameId) {
        //Currently on the game screen, have the view manager update the screen.
        views_manager.show(data.gameId, data);
      } else {
        //If the user is not watching the game, update the information we have in the background.
        if (data.gameId.indexOf("goof") !== -1) {
          window.goofspiel.updateView(window.activeGames[data.gameId].view, data);
        } else if (data.gameId.indexOf("seve") !== -1) {
          window.sevens.updateView(window.activeGames[data.gameId].view, data);
        } else if (data.gameId.indexOf("war") !== -1) {
          window.war.updateView(window.activeGames[data.gameId].view, data);
        }

        //Show  notification if user is supposed to make a move
        $("#alert").promise().done(() => {
          //Is it the player's turn?
          if (data.currentPlayers && userIsIn(data.currentPlayers, myUsername)) {
            let $alert = $("#alert");
            let $gameButton = $(`#${data.gameId}`);
            let gameName = $gameButton.text();
            $alert.on('click', (event) => {
              //Mimic clicking the game button (so the styling/logic is consistent)
              $gameButton.trigger('click');
            });
            $gameButton.find('.badge').text(' !');
            //Display the alert
            $alert.find(".card-body").text(`It is your turn in ${gameName}. `);
            $alert.toggle('slide', 1000, () => {
              setTimeout(() => $alert.toggle('slide', 1000), 1000);
            })
          }
        });
      }
    }
  });

  //Server sends leaderboard information
  socket.on('leaderBoard', (data) => {
    $('#landing-container').css({ display: 'none' });
    views_manager.show('leaderboard', data);
  });

  socket.emit('msg', "hi there"); //Hello message to server ;)



  socket.on('history', (data) => {
    $('#landing-container').css({ display: 'none' }); //Hides landing page
    if (data[0]) {
      profile.updateMatchHistoryTable(data);
      socket.emit('requestMatchDetails', data[0].id);
    } else {
      //This will only happen when user searches someone that doesnt' exist OR first time user
      let histMessage = $("#historyErrorMessage");
      if (histMessage) {
        profile.updateMatchHistoryTable(data);
        $("#historyErrorMessage").text("User does not exist");
      } else {
        profile.updateMatchHistoryTable(data);
      }
    }
  });

  socket.on('matchDetails', (data) => {
    profile.updateMatchSpecificTable(data);
    views_manager.show('profile');
  })

  socket.on('msg', (data) => {
    console.log(data); //Useful for sending a message between client and server
  });
  socket.on('connection', (data) => {
    console.log(data); //Welcome message from server
  })

});



