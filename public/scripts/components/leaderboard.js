$(() => {
  //Need to generate this for each game. May need to make a game container first
  window.$leaderboard = $(`
<div id="leaderboardContainer">
  <h1>Leaderboard </h1>
  <div class="dropdown">
    <button class="btn btn-secondary dropdown-toggle" type="button" id="leaderboardDropdown" data-toggle="dropdown"
      aria-haspopup="true" aria-expanded="false">
      Goofspiel
    </button>
    <div class="dropdown-menu" aria-labelledby="leaderboardDropdown">
      <a class="dropdown-item" id="goofLead">Goofspiel</a>
      <a class="dropdown-item" id="warLead">War</a>
    </div>
  </div>

  <table class="table table-striped table-hover" id="leaderboardTable">
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Username</th>
        <th scope="col">Score</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Owen Ripley</td>
        <td>999</td>
      </tr>
      <tr>
        <th scope="row">2</th>
        <td>TH</td>
        <td>998</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>John Snow</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>
      <tr>
        <th scope="row">3</th>
        <td>Arya Stark</td>
        <td>997</td>
      </tr>

      </tr>
    </tbody>
  </table>
</div>`);

  window.leaderboard = {};
  window.leaderboard.updateTable = function(data) {

    let leaderboardTable = window.$leaderboard.find("#leaderboardTable");
    leaderboardTable.empty();
    console.log(`Trying to display ${data}`);
    console.log(data);
    console.log(leaderboardTable);
    let str = `<thead>
        <tr>
          <th scope="col"></th>
          <th scope="col">Username</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
      <tr>
      `;
    data.forEach((el, i) => {
      str += `
 <th scope="row">${i + 1}</th>
        <td>${el.username}</td>
        <td>${el.users_total_game_score}</td>
      </tr>
 `
    });
    $(str).appendTo(leaderboardTable);


    //Set the leaderboard object based on the data provided
    // window.$leaderboard = $(str);
  };


  $('#goofLead').on('click', () => {
    console.log('request for goofspiel leaderboard');
  })

  $('#warLead').on('click', () => {
    console.log('request for war leaderboard');
  })

});
