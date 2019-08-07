// Initial array of gifs
var gifs = ["Sad", "Joy", "Boring", "Sexual Desire", "Shame", "Meh", "uwu", "Ew"];

// displayGif function re-renders the HTML to display the appropriate content
function displayGif() {

  var gif = $(this).attr("data-name");
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + gif + "&apikey=rpr5DaDpOuJQ1PYsyFVOMdUug6AbySsV&limit=20";

  // Creates AJAX call for the specific gif button being clicked
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    for (var i = 0; i<response.data.length; i++){
    var newDiv = $('<div>');
    newDiv.addClass('gifContainer');
    newDiv.append('<p>'+response.data[i].rating);
    var newimage = $('<img src="'+response.data[i].images.fixed_height_still.url+'">');
    newimage.addClass('gif-image');
    newimage.attr('state','still');
    newimage.attr('still-state',response.data[i].images.fixed_height_still.url);
    newimage.attr('animate-state',response.data[i].images.fixed_height.url);
    newDiv.append(newimage);
    $('#gif-view').prepend(newDiv);
    };
    $('.gif-image').on('click', function(){
      if($(this).attr('state')==='still'){
        $(this).attr('state','animate');
        $(this).attr('src',$(this).attr('animate-state'));
      }
      else{
        $(this).attr('state','still');
        $(this).attr('src',$(this).attr('still-state'));
      }
    });
    
  });

}

// Function for displaying gif data
function renderButtons() {

  // Deletes the gifs prior to adding new gifs
  // (this is necessary otherwise you will have repeat buttons)
  $("#buttons-view").empty();
  // Loops through the array of gifs
  for (var i = 0; i < gifs.length; i++) {

    // Then dynamicaly generates buttons for each gif in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    var a = $("<button>");
    // Adds a class of gif to our button
    a.addClass("gif");
    // Added a data-attribute
    a.attr("data-name", gifs[i]);
    // Provided the initial button text
    a.text(gifs[i]);
    // Added the button to the buttons-view div
    $("#buttons-view").append(a);
  }
}

// This function handles events where the add gif button is clicked
$("#add-gif").on("click", function(event) {
  event.preventDefault();
  // This line of code will grab the input from the textbox
  var gif = $("#gif-input").val().trim();

  // The gif from the textbox is then added to our array
  gifs.push(gif);

  // Calling renderButtons which handles the processing of our gif array
  renderButtons();
});

// Adding click event listeners to all elements with a class of "gif"
$(document).on("click", ".gif", displayGif);

// Calling the renderButtons function to display the intial buttons
renderButtons();