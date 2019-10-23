$(() => {
  //Need to generate this for each game. May need to make a game container first
  window.$profile = $(`
<div id="matchHistoryContainer">
  <h1> CurrentUsers's Match history </h1>

  <form>
    <div class="form-row">
      <div class="col">
        <input type="text" class="form-control" placeholder="🔍Search for a user..." id="user-to-search">
          </div>
        <div class="col">
          <button class="btn btn-primary mb-2" id="reqMatchHistoryBut">Search</button>
        </div>
      </div>
      </form>


    <table class="table table-striped table-hover" id="matchHistoryTable">
      <thead>
        <tr>
          <th scope="col">Game mode</th>
          <th scope="col">Placing</th>
          <th scope="col">Score</th>
          <th scope="col">Date-time</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
          <td>2019-10-23 22:39</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
          <td>2019-10-23 22:39</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
          <td>2019-10-23 22:39</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
          <td>2019-10-23 22:39</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
          <td>2019-10-23 22:39</td>
        </tr>

      </tbody>
    </table>

    <table class="table table-striped" id="match-specific">
      <thead>
        <tr>
          <th scope="col">Username</th>
          <th scope="col">Position</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
        </tr>
        <tr>
          <td scope="row">Goofspiel</td>
          <td>2</td>
          <td>100</td>
        </tr>
      </tbody>
    </table>
    </div>`);



  window.profile = {};
  window.profile.updateMatchHistoryTable = function(data) {

    let matchesTable = window.$profile.find("#matchHistoryTable"); //Grab the Jquery result for the query

    matchesTable.empty();//clear just this table

    console.log(`Trying to display ${data}`);
    let str = `<
        <thead>
          <tr>
            <th scope="col">Game mode</th>
            <th scope="col">Placing</th>
            <th scope="col">Score</th>
            <th scope="col">Date-time</th>
          </tr>
        </thead>
        <tbody>`;
    data.forEach((el) => {
      str += `<tr id="${el.id}" class="match_row">
          <td scope="row">${el.gametype}</td>
          <td>${el.finished_position}</td>
          <td>${el.score}</td>
          <td>${(new Date(el.time_stamp)).toLocaleString()}</td>
        </tr>`;
    });

    str += `</tbody>`;
    $(str).appendTo(matchesTable);

  };


  window.profile.updateMatchSpecificTable = function(data) {

    let matchSpecificTable = window.$profile.find("#match-specific");

    matchSpecificTable.empty();

    console.log(`Trying to display ${data}`);
    let str = `<
    <thead>
    <tr>
      <th scope="col">Username</th>
      <th scope="col">Placing</th>
      <th scope="col">Score</th>
    </tr>
  </thead>
  <tbody>
    `;
    data.forEach((el) => {
      str += `<tr id="${el.id}" class="match_row">
          <td scope="row">${el.username}</td>
          <td>${el.placing}</td>
          <td>${el.score}</td>
        </tr>`;
    });

    str += `</tbody>`;
    $(str).appendTo(matchSpecificTable);

  };


  $('#warLead').on('click', () => {
    console.log('request for war profile');
  })
});
