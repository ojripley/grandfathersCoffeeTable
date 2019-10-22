$(() => {
  const $main = $('#main-content');

  window.views_manager = {};
  $leaderboard.detach();
  //$goofspiel.dettach();
  // $profile.dettach();

  window.views_manager.show = function(item) {
    switch (item) {
      case 'leaderboard':
        $leaderboard.appendTo($main);
        break;
      case 'goofspiel':
        $searchPropertyForm.appendTo($main);
        break;
      case 'profile':
        $searchPropertyForm.appendTo($main);
        break;
      case 'goofspiel':
        $searchPropertyForm.appendTo($main);
        break;
      case 'error': {
        const $error = $(`<p>${arguments[1]}</p>`);
        $error.appendTo('body');
        setTimeout(() => {
          $error.remove();
          views_manager.show('listings');
        }, 2000);

        break;
      }
    }

  }
});
