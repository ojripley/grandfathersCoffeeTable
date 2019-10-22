$(() => {
  //Need to generate this for each game. May need to make a game container first
  window.$profile = $(`
<div id="matchHistoryContainer">
  <h1> CurrentUsers's Match history </h1>

  <form>
    <div class="form-row">
      <div class="col">
        <input type="text" class="form-control" placeholder="🔍Search for a user...">
          </div>
        <div class="col">
          <button class="btn btn-primary mb-2" id="reqMatchHistoryBut">Search</button>
        </div>
      </div>
      </form>


    <table class="table table-striped table-hover">
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
});
