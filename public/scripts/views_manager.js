$(() => {
  const $main = $('#main-content');

  window.views_manager = {};


  window.views_manager.show = function(item, data = "test") {
    $leaderboard.detach();
    $goofspiel.detach();
    $profile.detach();
    console.log(`requesting the ${item} screen `)
    switch (item.substring(0, 4)) {
      case 'lead':
        window.curGame = item;
        leaderboard.updateTable(data);
        $leaderboard.appendTo($main);
        break;
      case 'goof':
        goofspiel.updateView(data);
        $goofspiel.appendTo($main);
        break;
      case 'warr':
        //Make a version of the view for war
        goofspiel.updateView(data);
        $goofspiel.appendTo($main);
        break;
      case 'prof':
        $profile.appendTo($main);
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
