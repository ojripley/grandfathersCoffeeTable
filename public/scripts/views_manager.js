$(() => {
  const $main = $('#main-content');

  window.views_manager = {};
  window.activeGames = {};


  window.views_manager.show = function(item, data = 'none') {

    $leaderboard.detach();
    $profile.detach();
    $('#landing-container').css({ display: 'none' });
    for (let game in window.activeGames) {
      window.activeGames[game].view.detach();
    }
    $(`#${window.curScreen}`).removeClass("selected");
    if (item !== "profile" && item !== "leaderboard") {
      $(`#${item}`).addClass("selected");
    }
    switch (item.substring(0, 4)) {
      //Decide which screen to render
      case 'lead':
        window.curScreen = 'leaderboard';
        leaderboard.updateTable(data);
        $leaderboard.appendTo($main);

        $('#goofLead').on('click', (event) => {
          event.preventDefault();
          $("#leaderboardDropdown").text("Goofspiel");
          socket.emit('requestLeaderBoard', 'goofspiel');
        });
        $('#warLead').on('click', (event) => {
          event.preventDefault();
          $("#leaderboardDropdown").text("War");
          socket.emit('requestLeaderBoard', 'warr');
        });
        $('#seveLead').on('click', (event) => {
          event.preventDefault();
          $("#leaderboardDropdown").text("Sevens");
          socket.emit('requestLeaderBoard', 'sevens');
        });
        break;
      case 'prof':
        window.curScreen = 'cur-history-button';
        $profile.appendTo($main);
        //Search bar functionality
        $('#reqMatchHistoryBut').on('click', (event) => {
          event.preventDefault();
          let userToSearch = $("#user-to-search").val();
          $("#matchHistoryHeader").text(` ${userToSearch}'s Match history `)
          socket.emit('requestHistory', userToSearch);
        });
        window.curMatchStats = 0;

        $('.match_row').hover((event) => {
          let matchId = $(event.target).parent().attr('id');
          if (matchId != window.curMatchStats) {
            socket.emit('requestMatchDetails', matchId);
            window.curMatchStats = matchId;
          }
        });

        break;
      case 'goof':
        if (data.gameState === "playing") { //If we are in the playing game state
          goofspiel.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            $('#landing-container').css({ display: 'grid' });
          });
        } else if (data.gameState === "pending" || data === "none") {
          //If we are waiting for another player or game does not exist

          window.activeGames[item].view.appendTo($main);
        } else {
          goofspiel.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            $('#landing-container').css({ display: 'grid' });
          });
        }

        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.playable').on('click', (event) => {

          let cardName = event.target.id;
          let card = findCardByName(cardName, window.activeGames[item].myCards);

          socket.emit('move', {
            gameId: window.curScreen,
            move: {
              player: window.activeGames[item].player,
              card
            }
          }); //Send the client's player object & card
        });
        window.curScreen = item;
        break;
      case 'warr':
        if (data.gameState === "playing") { //If we are in the playing game state
          war.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            window.views_manager.show('lead');
          });
        } else if (data.gameState === "pending" || data === "none") {
          //If we are waiting for another player or game does not exist
          console.log("rendering this:");
          console.log(item);
          // goofspiel.updateView(window.activeGames[item].view, data);
          console.log(window.activeGames[item].view);
          window.activeGames[item].view.appendTo($main);
        } else {
          war.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {

            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            $('#landing-container').css({ display: 'grid' });
            // window.views_manager.show('leaderboard');
          });
        }
        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.playable').on('click', (event) => {
          // let $chosenCard = $(event.target);
          let cardName = event.target.id;
          let card = findCardByName(cardName, window.activeGames[item].myCards);

          socket.emit('move', {
            gameId: window.curScreen,
            move: {
              player: window.activeGames[item].player,
              card
            }
          }); //Send the client's player object & card
        });

        window.curScreen = item;
        break;
      case 'seve':
        if (data.gameState === "playing") { //If we are in the playing game state
          sevens.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);

          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            $('#landing-container').css({ display: 'grid' });
          });
        } else if (data.gameState === "pending" || data === "none") {
          //If we are waiting for another player or game does not exist
          window.activeGames[item].view.appendTo($main);
        } else {
          sevens.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            $('#landing-container').css({ display: 'grid' });
          });
        }
        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.playable').on('click', (event) => {

          // let $chosenCard = $(event.target);
          let cardName = event.target.id;
          let card = findCardByName(cardName, window.activeGames[item].myCards);
          if (!card.playable) {
            //alert the user they can't play this card.
          } else {
            socket.emit('move', {
              gameId: window.curScreen,
              move: {
                player: window.activeGames[item].player,
                card
              }
            }); //Send the client's player object & card
          }
        });

        $('#pass-button').on('click', (event) => {
          socket.emit('move', {
            gameId: window.curScreen,
            move: {
              player: window.activeGames[item].player,
              card: null
            }
          });

        });
        window.curScreen = item;
        break;
    }
  }
});
