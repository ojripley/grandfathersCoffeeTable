$(() => {

  window.goofspiel = {};

  //Create a new goofspiel game (default state).
  //Change this to show a loading screen
  window.goofspiel.newGame = function(id) {
    window.activeGames[id] = {};
    window.activeGames[id].view = $(`<div id="game-container">
    <div id="tableArea">
      The table
      <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="2" style="width: 50%"></div>
      </div>
      <p id="progress-text"> 1/2 </p>
    </div>
    <div id="p1Area">
      <div class="playerHand">
      </div>
    </div>
    <div id="p2Area">
      Player 2
    </div>
    <div id="p3Area">
      Player 3
    </div>
    <div id="p4Area">
      Player 4
    </div>
  </div>`);
  };

  window.goofspiel.joinUser = function($game, data) {

  }
  window.goofspiel.updateView = function($game, data) {
    $game.empty(); //Clear what we had before
    let player = findPlayer(data.players, window.myUsername);

    window.activeGames[data.gameId].player = player;
    window.activeGames[data.gameId].myCards = player.hand.cards;


    let playerCards = ``;
    for (let card of player.hand.cards) {
      //Add playable state here
      playerCards += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content" id="${card.name}"></img>`;
    }

    let tableCards = ``;
    for (let card of data.table.cards) {
      //Visibility state must be set based on goofspiel logic


      tableCards += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content"></img>`;
    }

    let pendingCards = ``;
    let hiddenCards = [];
    for (let i in data.pendingMoves) {
      //Pending moves are face down
      let card = data.pendingMoves[i].card;
      if (data.pendingMoves.length < data.players.length) {
        pendingCards += `<img src="./images/cards/PNG/blue_back.png" class="card img-fluid ui-widget-content"></img>`;
      } else {
        hiddenCards.push(`./images/cards/PNG/${card.name}.png`);
        pendingCards += `<img src="./images/cards/PNG/blue_back.png" class="card img-fluid ui-widget-content" id="hidden${i}"></img>`;
      }
    }


    console.log("playerCards");
    console.log(playerCards);
    console.log("tableCards");
    console.log(tableCards);
    console.log("pendingCards");
    console.log(pendingCards);

    window.activeGames[data.gameId].view = $(`
    <div id="game-container">
    <div id="tableArea">
      ${tableCards}
      ${pendingCards}
    </div>
    <div id="p1Area">
      <div class="playerHand">
      ${playerCards}
      </div>
    </div>
    <div id="p2Area">
      Player 2
    </div>
    <div id="p3Area">
      Player 3
    </div>
    <div id="p4Area">
      Player 4
    </div>
  </div>
`);
    if (hiddenCards.length > 0) {
      for (let i in hiddenCards) {
        let el = window.activeGames[data.gameId].view.find(`#hidden${i}`);
        console.log("The jquery element is:");
        console.log(el.attr("id"));

        setTimeout(() => {
          el.attr('src', hiddenCards[i]);

        }, 1000);

        //Fade effect to show the hidden card. Takes 1.5s.
        //Fades to gray, then fades back.
        /*
        el.fadeTo(1000, 0.5, () => {
          el.attr('src', hiddenCards[i]);
        }).fadeTo(500, 1);
        */
      }
    }



  };

});
