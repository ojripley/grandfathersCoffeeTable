$(() => {


  //Nav bar logic:
  $('#menu-bars').on('click', (event) => {

    $('#navbar').toggleClass('hidden', 500);
  });


  $(function() {
    $("#2C").draggable();
  });


  //Create some on-clicks for testing purposes:
  console.log($(".playerHand"));
  console.log('hi');

  $('.card').on('click', (event) => {
    // let $chosenCard = $(event.target);
    let cardName = event.target.id;
    console.log(cardName);
    // console.log($chosenCard.attr("id"));
    console.log('click');
    //Makes a move if it is the player's turn

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
