// var destination = ""


$(document).ready(function () {

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://www.eventbriteapi.com/v3/events/search?start_date.range_start=2019-08-08T00:00:01Z&start_date.range_end=2019-08-14T00:00:01Z&location.address=houston&location.within=20mi&expand=venue&token=TB4LWRWVPSS75WH4DMMJ",
        "method": "GET",
        "headers": {
          "User-Agent": "PostmanRuntime/7.15.2",
          "Accept": "*/*",
          "Cache-Control": "no-cache",
          "Postman-Token": "b02ddef0-1feb-4f86-b0b9-16ed5d412b9a,94d435a1-0733-44f2-9b07-a24192fe5da5",
          "Cookie": "mgrefby=; AS=904da408-1520-4f37-8b22-ffb9fa495913; mgref=typeins; G=v%3D2%26i%3De409e6a7-d582-4106-851b-eb14d8463d08%26a%3Dbcb%26s%3D3d015e0540d4378bb70feaca126a1a56f7b85be3; eblang=lo%3Den_US%26la%3Den-us; SS=AE3DLHTMba0WmdGjQRggMscD_oeSjktlZQ; SP=AGQgbblZRSiM3mT8g6xGLSKoux7SKdYMp19Ni2xhEPcmhC8O3U0x4f9RfEIxdKWnqaJ7EzrYPdrLuQh6DP4sEDEuJ8RY41pZVUTZqBOSAPubyvxjTBFpqrXtSVbBLwHulQtwDTIB1gYpGQ3IsGDtISoDPvDUfhUXErJIaPAD64hbjIVK3D8PbHV0e3M5TZujcqM_w3TKPqd_7cfrwuHj9ezWftR0Eus2Jzf786eeSZyYWA3hMocgkuk",
          "Accept-Encoding": "gzip, deflate",
          "Referer": "https://www.eventbriteapi.com/v3/events/search?start_date.range_start=2019-08-08T00:00:01Z&start_date.range_end=2019-08-14T00:00:01Z&location.address=houston&location.within=20mi&expand=venue&token=TB4LWRWVPSS75WH4DMMJ",
          "Connection": "keep-alive",
          "cache-control": "no-cache"
        }
      }
      
      $.ajax(settings).done(function (response) {
        console.log(response);
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
