$(() => {
  const $main = $('#main-content');

  window.views_manager = {};


  window.views_manager.show = function(item, data = "test") {
    $leaderboard.detach();
    $goofspiel.detach();
    $profile.detach();
    console.log(`requesting the ${item} screen `)
    switch (item) {
      case 'leaderboard':
        leaderboard.updateTable(data);
        $leaderboard.appendTo($main);
        break;
      case 'goof':
        $goofspiel.appendTo($main);
        break;
      case 'profile':
        $profile.appendTo($main);
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('goofspiel');
        }, 2000);
        break;
      }
    }

  }
});
