// var destination = ""


$(document).ready(function () {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.eventbriteapi.com/v3/events/search?start_date.range_start=2019-08-08T00:00:01Z&start_date.range_end=2019-08-14T00:00:01Z&location.address=houston&location.within=20mi&expand=venue&token=TB4LWRWVPSS75WH4DMMJ",
        "method": "GET",
        "headers": {
          "Accept": "*/*",
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Headers" :"Authorization, Content-Type, Eventbrite-API-Waypoint-Token, Eventbrite-API-Deprecated-Features",
          "Cache-Control": "no-cache",
          "Postman-Token": "631c045a-8ecd-4fa1-a862-111084a04fa6,93fc455e-bb7a-4cb9-8464-1a9bad801696",
          "cache-control": "no-cache"
        }
      }
      
      $.ajax(settings).then(function (response) {
        console.log(response);
        console.log(response.location.latitude)
      });

    function weatherDisplay(destination, startDate, los) {
        console.log("city: " + destination + " date: " + startDate)

        var apiKey = "69cdf8b4bec4466698885c67324ab8c2"
        // var city = "houston,TX"
        // var counytryID = "us"
        var queryURL = "https://api.weatherbit.io/v2.0/forecast/daily?" + "city=" + destination + /*"&country=" + counytryID + */ "&key=" + apiKey;
        // Creating an AJAX call for the specific weather button being clicked
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            console.log(queryURL)
            // console.log(JSON.stringify(response))
            console.log(response)
            var weatherDate = []
            var weatherIcon = []
            var weatherDescription = []
            var weatherTemp = []
            var weatherMin = []
            var weatherMax = []

            for (var i = 0; i < response.data.length; i++) {

                if (moment(response.data[i].valid_date).unix() === moment(startDate).unix()) {
                    break;
                }
            }

            console.log("value of i: " + i)

            var counter = 0

            while (counter <= los) {
                weatherDate.push(response.data[i + counter].valid_date)
                weatherIcon.push(response.data[i + counter].weather.icon)
                weatherDescription.push(response.data[i + counter].weather.description)
                weatherTemp.push(response.data[i + counter].temp)
                weatherMin.push(response.data[i + counter].min_temp)
                weatherMax.push(response.data[i + counter].max_temp)
                counter++
            }

            console.log("length of data array: " + weatherDate.length)
            console.log(weatherDate);
            console.log(weatherIcon);

            for (var j = 0; j < weatherIcon.length; j++) {
                var iconURL = "https://www.weatherbit.io/static/img/icons/" + weatherIcon[j] + ".png"

                var iconDiv = $("<div class='icon float-left'>");
                var iconFig = $("<figure>")
                iconFig.addClass("figure text-center")

                var iconTemp = $("<figcaption>")
                iconTemp.addClass("figure-caption")
                iconTemp.html(weatherTemp[j])


                var iconTempRange = $("<figcaption>")
                iconTempRange.addClass("figure-caption")
                iconTempRange.html("Min " + weatherMin[j] + " Max " + weatherMax[j])

                var iconCaption = $("<figcaption>")
                iconCaption.addClass("figure-caption")
                iconCaption.html(weatherDescription[j])

                var image = $("<img>");
                image.addClass("figure-img img-fluid text-center")
                image.attr("src", iconURL)

                iconFig.append(image)
                iconFig.append(
                    $("<h6>").html(weatherDate[j])
                )
                iconFig.append(iconTemp)
                iconFig.append(iconTempRange)
                iconFig.append(iconCaption)

                iconDiv.append(iconFig)
                $("#weather").append(iconDiv)

            }
        });
    }

    function eventDisplay(startDate, endDate) {
        console.log("hello")
    }

    $('#trippinButton').click(function () {
        event.preventDefault();
        $('#resultContainer').css('display', 'block')
        $('#planningContainer').css('display', 'none')

        var destination = $("#to").val().trim()
        console.log(destination);

        // grab start date
        var startDate = $("#startdt").val();

        //  grab end date
        var endDate = $("#enddt").val();

        var los = moment(endDate).diff(moment(startDate), "days")
        console.log("LOS: " + los)

        if (los > 16) {
            alert("Please choose your length of stay less then 16 days")
            return;
        }

        weatherDisplay(destination, startDate, los)

        var token = "TB4LWRWVPSS75WH4DMMJ"


    });




})



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
