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
        leaderboard.updateTable(data);
        $leaderboard.appendTo($main);
        break;
      case 'prof':
        $profile.appendTo($main);
        break;
      case 'goof':
        if (data.players) { //Temporary
          //This line is called whenever there is an additional card to display
          goofspiel.updateView(window.activeGames[item].view, data);
        }
        window.activeGames[item].view.appendTo($main);

        //Add game-specific listeners
        $('.card').on('click', (event) => {
          // let $chosenCard = $(event.target);
          let cardName = event.target.id;
          findCardByName(cardName);
          console.log(cardName);
          console.log('click');
          socket.emit('move', 'hello'); //Send the client's player object & card
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
