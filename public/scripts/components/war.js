$(() => {

  window.war = {};
  //Create a new war game (default state).
  //Change this to show a loading screen
  window.war.newGame = function(id) {
    window.activeGames[id] = {};
    window.activeGames[id].view = $(`<div id="game-container" class="war">
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

  window.war.updateView = function($game, data) {
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
          playersCards[i] += `<img src="./images/cards/PNG/${card.name}.png" class="playable playing-card img-fluid ui-widget-content" id="${card.name}"></img>`;
        } else {
          playersCards[i] += `<img src="./images/cards/PNG/blue_back.png" class="playing-card img-fluid ui-widget-content"></img>`;
        }
      }
    }
    console.log(playersCards);



    let tableCards = ``;
    for (let card of data.table.cards) {
      //Visibility state must be set based on war logic


      tableCards += `<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content"></img>`;
    }

    let pendingCards = ``;
    let hiddenCards = [];
    for (let i in data.pendingMoves) {
      //Pending moves are face down
      let card = data.pendingMoves[i].card;
      let theOneWhoPlays = data.pendingMoves[i].player.username; //Stores who played the card
      if (data.pendingMoves.length < data.players.length) {
        if (theOneWhoPlays === myUsername) {
          pendingCards += `<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content" id="p1pendingCard"></img>`;
        } else {
          pendingCards += `<img src="./images/cards/PNG/blue_back.png" class="playing-card img-fluid ui-widget-content" id="p${players.findIndex((player) => player.username === theOneWhoPlays) + 1}pendingCard"></img>`;
        }
      } else {
        if (theOneWhoPlays === myUsername) {
          pendingCards += `<img src="./images/cards/PNG/${card.name}.png" class="playing-card img-fluid ui-widget-content" id="p1pendingCard"></img>`;
        } else {
          hiddenCards.push(`./images/cards/PNG/${card.name}.png`);
          pendingCards += `<img src="./images/cards/PNG/blue_back.png" class="hidden playing-card img-fluid ui-widget-content" id="p${players.findIndex((player) => player.username === theOneWhoPlays) + 1}pendingCard"></img>`;
        }
      }
    }




    window.activeGames[data.gameId].view = $(`
    <div id="game-container">
    ${scoreboard}
    <div id="table-area-war">
    <h1 id="background-text"> W A R R </h1>
    <p id="player2Text">
    <span id="p2Name"> ${players[1].username}</span>
    <span id="p2score">- ${players[1].score} pts -</span>
    <span id="p2numCards">(${players[1].hand.cards.length} cards)</span>
    </p>
    ${tableCards}
    ${pendingCards}

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
    if (hiddenCards.length > 0) {
      for (let i in hiddenCards) {
        let el = window.activeGames[data.gameId].view.find(`.hidden`);
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
