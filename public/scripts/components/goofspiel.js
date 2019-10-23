$(() => {

  window.goofspiel = {};

  //Create a new goofspiel game (default state).
  //Change this to show a loading screen
  window.goofspiel.newGame = function(id) {
    window.activeGames[id] = {};
    window.activeGames[id].view = $(`<div id="game-container">
    <div id="tableArea">
    <div class ="myProgressBar">
    <div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="1" aria-valuemin="0" aria-valuemax="2" style="width: 50%"></div>
        </div>
        <p id="progress-text"> 1/2 </p>
      </div>
    </div>
    <div id="p1Area">
      <div class="playerHand">

      </div>
      <p id="player1Text">
      <span id="p1Name"> ${window.myUsername}</span>
      <span id="p1score"> - 0 pts - </span>
      <span id="p1numCards"> (0 cards) </span>
      </p>
    </div>
    <div id="p2Area">
    <p id="player2Text">
      <span id="p2Name"> Player 2</span>
      <span id="p2score">- 0 pts -</span>
      <span id="p2numCards">(0 cards)</span>
      </p>
    </div>
    <div id="p3Area">
    <p id="player3Text">
    <span id="p3Name"> Player 3</span>
    <span id="p3score">- 0 pts -</span>
    <span id="p3numCards">(0 cards)</span>
    </p>
    </div>
    <div id="p4Area">
    <p id="player4Text">
    <span id="p4Name"> Player 4</span>
    <span id="p4score">- 0 pts -</span>
    <span id="p3numCards">(0 cards)</span>
    </p>
    </div>
  </div>`);
  };

  window.goofspiel.joinUser = function($game, data) {
    //Update the view progress bar here if more than two players are joining

  }
  window.goofspiel.updateView = function($game, data) {
    $game.empty(); //Clear what we had before




    let players = findPlayer(data.players, window.myUsername);

    //Check if the game is over
    if (data.gameState === "finished") {
      let scoreBoard = `
      <table class="table table-striped table-hover" id="end-game-table">
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
        scoreBoard += `<tr>
          <td scope="row">${i + 1}</td>
          <td>${player.username}</td>
          <td>${player.score}</td>
        </tr>`;
      });

      scoreBoard += `</tbody> </table>`;


      window.activeGames[data.gameId].view = $(`
      <div id="game-container">

      <h1 id="end-game-header"> GAME OVER! </h1>
            ${scoreBoard}
        <button type="button" class="btn btn-warning" id="remove-game">Exit</button>
      </div>
      `);

      return;
    }
    console.log("Youy should not see this");
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
          playersCards[i] += `<img src="./images/cards/PNG/${card.name}.png" class="card img-fluid ui-widget-content" id="${card.name}"></img>`;
        } else {
          playersCards[i] += `<img src="./images/cards/PNG/blue_back.png" class="card img-fluid ui-widget-content"></img>`;
        }
      }
    }
    console.log(playersCards);



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

    window.activeGames[data.gameId].view = $(`
    <div id="game-container">
    <div id="tableArea">
    <h1 id="background-text"> G O O F S P I E L </h1>
    ${tableCards}
    ${pendingCards}
    </div>
    <div id="p1Area">
      <div class="playerHand">
      ${playersCards[0]}
      </div>
      <p id="player1Text">
      <span id="p1Name"> ${players[0].username}</span>
      <span id="p1score"> - ${players[0].score} pts - </span>
      <span id="p1numCards"> (${players[0].hand.cards.length} cards) </span>
      </p>
    </div>
    <div id="p2Area">
    <div class="playerHand">
    ${playersCards[1]}
    </div>

    <p id="player2Text">
      <span id="p2Name"> ${players[1].username}</span>
      <span id="p2score">- ${players[1].score} pts -</span>
      <span id="p2numCards">(${players[1].hand.cards.length} cards)</span>
      </p>
    </div>
    <div id="p3Area">
    <p id="player3Text">
    <span id="p3Name"> Player 3</span>
    <span id="p3score">- 0 pts -</span>
    <span id="p3numCards">(0 cards)</span>
    </p>
    </div>
    <div id="p4Area">
    <p id="player4Text">
    <span id="p4Name"> Player 4</span>
    <span id="p4score">- 0 pts -</span>
    <span id="p3numCards">(0 cards)</span>
    </p>
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
