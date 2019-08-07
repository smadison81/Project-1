$('#trippinButton').click(function(){
    event.preventDefault();
    $('#resultContainer').css('display','block')
    $('#planningContainer').css('display','none')

    console.log(to)
    console.log(from)
});


const options = {
    fuse_options : {
        shouldSort: true,
        threshold: 0.4,
        maxPatternLength: 32,
        keys: [{
            name: "IATA",
            weight: 0.6
          },
          {
            name: "name",
            weight: 0.4
          },
          {
            name: "city",
            weight: 0.2
          }
        ]
      }
  };
  
  AirportInput("to", options)
  AirportInput("from", options)