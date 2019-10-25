$(() => {
  window.sevens = {};

  //Create a new sevens game (default state).
  //Change this to show a loading screen
  window.sevens.newGame = function(id) {
    window.activeGames[id] = {};
    window.activeGames[id].view = $(`<div id="game-container" class="seve">
    <div id="table-area-war">
    <div class ="myProgressBar">
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="2" style="width: 50%"></div>
        </div>
        <p id="progress-text"> Searching for players (1/2) </p>
      </div>
    </div>
    <div id="p1Area">
      <div class="playerHand">

      </div>
      <p id="player1Text">
      <span id="p1Name"> </span>
      <span id="p1score"></span>
      <span id="p1numCards"> </span>
      </p>
    </div>
    <div id="p2Area">
    <p id="player2Text">
      <span id="p2Name"> </span>
      <span id="p2score"></span>
      <span id="p2numCards"></span>
      </p>
    </div>
  </div>`);
  };


  window.sevens.joinUser = function($game, data) {
    //Update the view progress bar here if more than two players are joining

  }

  window.sevens.updateView = function($game, data) {
    $game.empty(); //Clear what we had before

    let scoreboard = `
    <thead>
      <tr>
        <th scope="col">Placing</th>
        <th scope="col">Name</th>
        <th scope="col">Score</th>
      </tr>
    </thead>
    <tbody>`;

    data.players.forEach((player, i) => {
      console.log(player);
      scoreboard += `<tr>
        <td scope="row">${i + 1}</td>
        <td>${player.username}</td>
        <td>${player.score}</td>
      </tr>`;
    });

    scoreboard += `</tbody> </table>`;

    //Check if the game is over
    if (data.gameState === "finished") {
      scoreboard = `<table class="table table-striped table-hover" id="end-game-table">` + scoreboard;
      window.activeGames[data.gameId].view = $(`
      <div id="game-container">

      <h1 id="end-game-header"> GAME OVER! </h1>
            ${scoreboard}
        <button type="button" class="btn btn-warning" id="remove-game">Exit</button>
      </div>
      `);
      return;
    }
    scoreboard = `<table class="table table-striped table-hover" id="scoreboard">` + scoreboard;


    let players = orderPlayers(data.players, window.myUsername); //Get an array of the players
    window.activeGames[data.gameId].player = players[0];
    window.activeGames[data.gameId].myCards = players[0].hand.cards;


    //let playerCards = ``;
    let playersCards = [];
    for (let i in players) {
      playersCards[i] = ``;
      for (let card of players[i].hand.cards) {
        if (i == 0) {
          //This is the client, show their cards to them
          //Add playable state here
          playersCards[i] += `<img src="./images/cards/PNG/${card.name}.png" class="${card.playable ? "playable" : "unplayable"} playing-card img-fluid ui-widget-content" id="${card.name}"></img>`;
        } else {
          playersCards[i] += `<img src="./images/cards/PNG/blue_back.png" class="playing-card img-fluid ui-widget-content"></img>`;
        }
      }
    }

    let tableCards = [[], [], [], []];
    for (let card of data.table.cards) {
      //Check the suit
      switch (getSuit(card.name)) {
        case "H":
          tableCards[0].push(`<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content"></img>`);
          break;
        case "S":
          tableCards[1].push(`<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content"></img>`);
          break;

        case "D":
          tableCards[2].push(`<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content"></img>`);
          break;

        case "C":
          tableCards[3].push(`<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content"></img>`);
          break;
        default:
          break;
        // code block
      }

    }

    let heartCards = ``;
    if (tableCards[0]) {
      heartCards = tableCards[0].join(``);
    }

    let spadeCards = ``;
    if (tableCards[0]) {
      spadeCards = tableCards[1].join(``);
    }

    let diamondCards = ``;
    if (tableCards[0]) {
      diamondCards = tableCards[2].join(``);
    }

    let clubCards = ``;
    if (tableCards[0]) {
      clubCards = tableCards[3].join(``);
    }

    window.activeGames[data.gameId].view = $(`
    <div id="game-container">
    ${scoreboard}
    <div id="sevens-text-container">
        <h1 id="background-text-sevens"> S E V E N S </h1>
    </div>
    <button type="button" class="btn btn-secondary" id="pass-button">Pass</button>

    <div id="table-area-sevens">
    <p id="player2Text">
    <span id="p2Name"> ${players[1].username}</span>
    <span id="p2score">- ${players[1].score} pts -</span>
    <span id="p2numCards">(${players[1].hand.cards.length} cards)</span>
    </p>

    <div class="sevens-table-container" id="hearts">
    ${heartCards}
    </div>

    <div class="sevens-table-container" id="spades">
    ${spadeCards}
    </div>

    <div class="sevens-table-container" id="diamonds">
    ${diamondCards}
    </div>

    <div class="sevens-table-container" id="clubs">
    ${clubCards}
    </div>


    <p id="player1Text">
    <span id="p1Name"> ${players[0].username}</span>
    <span id="p1score"> - ${players[0].score} pts - </span>
    <span id="p1numCards"> (${players[0].hand.cards.length} cards) </span>
    </p>

    </div>
    <div id="p1Area">
      <div class="playerHand">
      <div class="card-container">
      ${playersCards[0]}
      </div>
      </div>

    </div>
    <div id="p2Area">
    <div class="playerHand">
    ${playersCards[1]}
    </div>


    </div>
  </div>
`);
  };

});
