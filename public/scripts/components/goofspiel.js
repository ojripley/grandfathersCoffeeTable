$(() => {
  //Need to generate this for each game. May need to make a game container first
  window.$goofspiel = $(`
  <div id="game-container">
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
</div>
`);

  window.goofspiel = {};

  window.goofspiel.updateView = function(data) {
    window.$goofspiel.empty(); //Clear what we had before;
    let player = findPlayer(data.players);
    let table = data.table;

    let playerCards = ``;
    for (let card in player.cards) {
      //Add playable state here
      playerCards += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content" id="${card.name}"></img>`;
    }

    let tableCards = ``;
    for (let card in table.cards) {
      //Visibility state must be set based on goofspiel logic
      tableCards += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content" id="${card.name}"></img>`;
    }

    window.$goofspiel = $(`
    <div id="game-container">
    <div id="tableArea">
      ${tableCards}
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
