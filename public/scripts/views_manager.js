$(() => {
  const $main = $('#main-content');

  window.views_manager = {};
  window.activeGames = {};


  window.views_manager.show = function(item, data = "test") {
    $leaderboard.detach();
    $profile.detach();
    for (let game in window.activeGames) {
      console.log(game);
      console.log(window.activeGames[game])
      window.activeGames[game].view.detach();
    }

    console.log(`requesting the ${item} screen `)
    switch (item.substring(0, 4)) {
      case 'lead':
        window.curGame = 'lead';
        console.log("sending...");
        console.log(data);
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
          socket.emit('requestLeaderBoard', 'war');
        });

        break;
      case 'prof':
        window.curGame = 'prof';
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
        if (data.players) { //If we are in the playing game state
          goofspiel.updateView(window.activeGames[item].view, data);
          window.activeGames[item].view.appendTo($main);
        } else {//If we are waiting for another player
          window.activeGames[item].view.appendTo($main);
        }

        //Add game-specific listeners
        //Change the logic here to check if the card is playable
        $('.card').on('click', (event) => {
          // let $chosenCard = $(event.target);
          console.log('click');
          let cardName = event.target.id;
          let card = findCardByName(cardName, window.activeGames[item].myCards);
          console.log("The card being sent is:")
          console.log(cardName);
          console.log("The card object:")
          console.log(card);
          console.log("My player object:")
          console.log(window.activeGames[item].player);

          socket.emit('move', {
            gameId: window.curGame,
            move: {
              player: window.activeGames[item].player,
              card
            }
          }); //Send the client's player object & card
        });

        window.curGame = item;
        break;
      case 'warr':
        //Make a version of the view for war
        goofspiel.updateView(data);
        $goofspiel.appendTo($main);
        break;

      /*  case 'erro': {
          const $error = $(`<p>${arguments[1]}</p>`);
          $error.appendTo('body');
          setTimeout(() => {
            $error.remove();
            views_manager.show('goofspiel');
          }, 2000);
          break;
        }*/
    }

  }
});
