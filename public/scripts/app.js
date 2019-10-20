$(() => {

  //Nav bar logic:
  $('#menu-bars').on('click', (event) => {

    $('#navbar').toggleClass('hidden', 500);
  });

  /*
    $.ajax({
      method: "GET",
      url: "/api/users"
    }).done((users) => {
      for (user of users) {
        $("<div>").text(user.name).appendTo($("body"));
      }
    });;
    */


});
