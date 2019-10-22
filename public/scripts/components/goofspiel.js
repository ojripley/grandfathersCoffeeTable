$(() => {

  window.goofspiel = {};

  //Create a new goofspiel game (default state).
  //Change this to show a loading screen
  window.goofspiel.newGame = function(id) {
    window.activeGames[id] = {};
    window.activeGames[id].view = $(`<div id="game-container">
    <div id="tableArea">
      The table
    </div>
    <div id="p1Area">
      <div class="playerHand">
        <img src="./images/cards/PNG/2C.png" class='card img-fluid ui-widget-content' id="2C">
        <img src="./images/cards/PNG/2H.png" class='card img-fluid' id="2H">
        <img src="./images/cards/PNG/2D.png" class='card img-fluid' id="2D">
        <img src="./images/cards/PNG/2S.png" class='card img-fluid' id="2S">
        <img src="./images/cards/PNG/3S.png" class='card img-fluid' id="3S">
        <img src="./images/cards/PNG/4S.png" class='card img-fluid' id="4S">
        <img src="./images/cards/PNG/5D.png" class='card img-fluid' id="5D">
        <img src="./images/cards/PNG/6H.png" class='card img-fluid' id="6H">
        <img src="./images/cards/PNG/7S.png" class='card img-fluid' id="7S">
        <img src="./images/cards/PNG/8C.png" class='card img-fluid' id="8C">
        <img src="./images/cards/PNG/9H.png" class='card img-fluid' id="9H">
        <img src="./images/cards/PNG/10C.png" class='card img-fluid' id="10C">
        <img src="./images/cards/PNG/KS.png" class='card img-fluid' id="KS">
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


  window.goofspiel.updateView = function($game, data) {
    $game.empty(); //Clear what we had before
    let player = findPlayer(data.players, window.myUsername);
    console.log("I think this is me:");
    console.log(player);
    window.activeGames[data.gameId].player = player;
    window.activeGames[data.gameId].myCards = player.hand.cards;
    console.log("my cards are");
    console.log(player.hand);

    // let table = data.table;

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
    for (let move of data.pendingMoves) {
      //Visibility state must be set based on goofspiel logic
      let card = move.card;
      pendingCards += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content" id="${card.name}"></img>`;
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
  };

});
