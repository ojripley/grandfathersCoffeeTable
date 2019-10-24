$(() => {
  const $main = $('#main-content');

  window.views_manager = {};
  window.activeGames = {};


  window.views_manager.show = function(item, data = 'none') {
    $leaderboard.detach();
    $profile.detach();
    for (let game in window.activeGames) {
      window.activeGames[game].view.detach();
    }


    console.log(`requesting the ${item} screen `)
    switch (item.substring(0, 4)) {
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

        break;
      case 'prof':
        window.curScreen = 'profile';
        $profile.appendTo($main);
        //Search bar functionality
        $('#reqMatchHistoryBut').on('click', (event) => {
          event.preventDefault();
          let userToSearch = $("#user-to-search").val();
          $("#matchHistoryHeader").text(` ${userToSearch}'s Match history `)
          socket.emit('requestHistory', userToSearch);
        })

        break;
      case 'goof':
        if (data.gameState === "playing") { //If we are in the playing game state
          goofspiel.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);

        } else if (data.gameState === "pending" || data === "none") {
          //If we are waiting for another player or game does not exist
          window.activeGames[item].view.appendTo($main);
        } else {
          goofspiel.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {
            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            window.views_manager.show('leaderboard');
          });
        }

        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.playablecard').on('click', (event) => {

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
          window.activeGames[item].view.appendTo($main);
        } else {
          console.log("the data" + data);
          war.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
          $("#remove-game").on('click', (event) => {

            $(`#${data.gameId}`).remove(); //Get rid of the game
            //Render a different screen
            window.views_manager.show('lead');
          });
        }

        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.playablecard').on('click', (event) => {
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


    }

  }
});
