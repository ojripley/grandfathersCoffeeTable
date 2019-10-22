$(() => {
  //Need to generate this for each game. May need to make a game container first
  window.$leaderboard = $(`<p>HELLO</p>`);


  $('#goofLead').on('click', () => {
    console.log('request for goofspiel leaderboard');
  })

  $('#warLead').on('click', () => {
    console.log('request for war leaderboard');
  })

});
