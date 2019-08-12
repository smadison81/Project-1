$(document).ready(function () {

    toLong = null;
    toLat = null;
    cityName = null;
    // eventbrite page count
    var pageCount
    var startDate
    var endDate
    var x
    var totPageCount
    var amadeusAccessToken = "q1ALrqA4I69mO9hYtFMUCTGATR5N"
    var webUrl = "https://test.api.amadeus.com/v1/shopping/flight-offers?origin="
    var toCity = null;
    var fromCity = null;
    var startDate = null
    var endDate = null

    // function to create truncated pagination
    var CLASS_DISABLED = "disabled",
        CLASS_ACTIVE = "active",
        CLASS_SIBLING_ACTIVE = "active-sibling",
        DATA_KEY = "pagination";


    $(".pagination").each(initPagination);

    function initPagination() {
        var $this = $(this);

        $this.data(DATA_KEY, $this.find("li").index(".active"));

        $this.find(".prev").on("click", navigateSinglePage);
        $this.find(".next").on("click", navigateSinglePage);
        $(document).on("click", "li", function () {
            pageCount = $(this).attr("value")
            console.log("pageCount: " + pageCount)
            var $parent = $(this).closest(".pagination");
            $parent.data(DATA_KEY, $parent.find("li").index(this));
            changePage.apply($parent);
            eventDisplay(startDate, endDate, pageCount)
        });
    }

    function navigateSinglePage() {
        if (!$(this).hasClass(CLASS_DISABLED)) {
            var $parent = $(this).closest(".pagination"),
                currActive = parseInt($parent.data("pagination"), 10);

            currActive += 1 * ($(this).hasClass("prev") ? -1 : 1);
            $parent.data(DATA_KEY, currActive);

            changePage.apply($parent);
        }
        eventDisplay(startDate, endDate, x)
    }

    function changePage(currActive) {
        var $list = $(this).find("li"),
            currActive = parseInt($(this).data(DATA_KEY), 10);

        $list.filter("." + CLASS_ACTIVE).removeClass(CLASS_ACTIVE);
        $list.filter("." + CLASS_SIBLING_ACTIVE).removeClass(CLASS_SIBLING_ACTIVE);

        $list.eq(currActive).addClass(CLASS_ACTIVE);
        x = $list.eq(currActive).attr("value")
        console.log("page x: " + x)

        if (currActive === 0) {
            $(this).find(".prev").addClass(CLASS_DISABLED);
        } else {
            $list.eq(currActive - 1).addClass(CLASS_SIBLING_ACTIVE);
            $(this).find(".prev").removeClass(CLASS_DISABLED);
        }

        if (currActive == ($list.length - 1)) {
            $(this).find(".next").addClass(CLASS_DISABLED);
        } else {
            $(this).find(".next").removeClass(CLASS_DISABLED);
        }
    }


    $('#trippinButton').click(function () {
        event.preventDefault();
        $('#resultContainer').css('display', 'block')
        $('#planningContainer').css('display', 'none')

        var destination = $("#to").val().trim()
        console.log(destination);

        // grab start date
        startDate = $("#startdt").val();

        //  grab end date
        endDate = $("#enddt").val();

        // grab destination longitude

        toLong = $("#to").data("lon")
        toLat = $("#to").data("lat")

        toCity = $("#to").data("iata")
        fromCity = $("#from").data("iata")

        console.log(toLong)
        console.log(toLat)

        var los = moment(endDate).diff(moment(startDate), "days")
        console.log("LOS: " + los)

        if (los > 16) {
            alert("Please choose your length of stay less then 16 days")
            return;
        }

        // call weather API and display
        weatherDisplay(destination, startDate, los)

        // call eventribe API and display icons
        eventDisplay(startDate, endDate)

        flightDisplay()

    });

    function weatherDisplay(destination, startDate, los) {
        console.log("city: " + destination + " date: " + startDate)

        var apiKey = "69cdf8b4bec4466698885c67324ab8c2"
        // var city = "houston,TX"
        // var counytryID = "us"
        var queryURL = "https://api.weatherbit.io/v2.0/forecast/daily?" + "lat=" + toLat + "&lon=" + toLong + "&key=" + apiKey;
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

            cityName = response.city_name;
            console.log(cityName)



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
                    $("<h6>").html(moment(weatherDate[j]).format("MMM-Do"))
                )
                iconFig.append(iconTemp)
                iconFig.append(iconTempRange)
                iconFig.append(iconCaption)

                iconDiv.append(iconFig)
                $("#weather").append(iconDiv)

            }
        });
    }

    function eventDisplay(startDate, endDate, pageCount, callback) {
        // clear div
        $("#event").empty()
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://www.eventbriteapi.com/v3/events/search?start_date.range_start=" + startDate + "T00:00:01Z&start_date.range_end=" + endDate + "T00:00:01Z&location.longitude=" + toLong + "&location.latitude=" + toLat + "&location.within=20mi&expand=venue&page=" + pageCount + "&token=TB4LWRWVPSS75WH4DMMJ",
            "method": "GET",
            "headers": {
                "Accept": "*/*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Authorization, Content-Type, Eventbrite-API-Waypoint-Token, Eventbrite-API-Deprecated-Features",
                "Cache-Control": "no-cache",
                "Postman-Token": "631c045a-8ecd-4fa1-a862-111084a04fa6,93fc455e-bb7a-4cb9-8464-1a9bad801696",
                "cache-control": "no-cache"
            }
        }

        $.ajax(settings).then(function (response) {
            console.log(response);
            // test response
            console.log(response.location.latitude)
            console.log(response.events.length)

            $(".totalEvent").html(response.pagination.object_count)
            totPageCount = response.pagination.page_count
            console.log("button:" + totPageCount)

            for (var i = 0; i < response.events.length; i++) {


                var a = $("<div class= card>") //this is the parent div
                a.addClass("mb-3")
                a.css("max-width", "600px")

                var b = $("<div class=row>")
                b.addClass("no-gutters")

                var c = $("<div class=col-md-4>")

                var imgEvent = $("<img class=card-img>")
                imgEvent.attr("src", response.events[i].logo.url)
                imgEvent.css("height", "fit-content")

                var d = $("<div class=col-md-8>")

                var e = $("<div class=card-body>")

                var f = $("<h5 class=card-title>")
                f.html("<a href=" + response.events[i].url + " " + "target=_blank>" + response.events[i].name.text + "</a>") //title

                var g = $("<h6 class= card-text>")
                g.addClass("text-muted")
                g.html(moment(response.events[i].start.local).format("ddd,MMM,Do,h:mm a"))

                var h = $("<h6 class= card-text >")
                h.addClass("text-muted")
                h.html(response.events[i].venue.name + "," + response.events[i].venue.address.city + "," + response.events[i].venue.address.region)

                e.append(f)
                e.append(g)
                e.append(h)

                d.append(e)

                c.append(imgEvent)

                b.append(c)
                b.append(d)

                a.append(b)

                $("#event").append(a)

                // dynamically create truncated pagination

            }

            callback()
        });
    }

    function createPagination() {
        for (var i = 1; i <= totPageCount; i++) {
            var a = $("<li>")
            if (i === 1) {
                a.addClass("active")
                a.attr("value", [i])
                a.html("<a href=#" + [i] + " " + "class=pageno>" + [i] + "</a>")
                $("#pagelist").append(a)
            } else {
                a.attr("value", [i])
                a.html("<a href=#" + [i] + " " + "class=pageno>" + [i] + "</a>")
                $("#pagelist").append(a)
            }
        }
    }


    $('#trippinButton').click(function () {
        event.preventDefault();
        $('#resultContainer').css('display', 'block')
        $('#planningContainer').css('display', 'none')
        $(".container").removeClass("d-none")

        var destination = $("#to").val().trim()
        console.log(destination);

        // grab start date
        startDate = $("#startdt").val();

        //  grab end date
        endDate = $("#enddt").val();

        // grab destination longitude

        toLong = $("#to").data("lon")
        toLat = $("#to").data("lat")

        console.log(toLong)
        console.log(toLat)

        var los = moment(endDate).diff(moment(startDate), "days")
        console.log("LOS: " + los)

        if (los > 16) {
            alert("Please choose your length of stay less then 16 days")
            return;
        }

        // call weather API and display
        weatherDisplay(destination, startDate, los)

        // call eventribe API and display icons
        pageCount = 1
        eventDisplay(startDate, endDate, pageCount, createPagination)

    });


    function flightDisplay() {
        $.ajax({
            type: "get",
            url: webUrl + fromCity + "&destination=" + toCity + "&departureDate=" + startDate +
                "&returnDate=" + endDate + "&max=5&nonStop=true",
            dataType: 'json',
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization',
                    'Bearer ' + amadeusAccessToken);
            },
            success: function (json) {

                console.log(json)
                loadFlights(json)
            }
        });
    }

    function loadFlights(flights) {

        //loop over all of the flight data.
        for (var i = 0; i < flights.data.length; i++) {

            // get the current flight offer
            var flightOffer = flights.data[i];

            // read in the price, tax and calculate the total cost.
            var price = parseFloat(flightOffer.offerItems.price.total);
            var tax = parseFloat(flightOffer.OfferItems.price.totalTaxes);
            var totalPrice = price + tax;

            // create a new html element to hold the flight details.
            var flightSection = document.createElement('div');

            // set the id to the flight offer id.
            flightSection.setAttribute("id", flightOffer.id);

            // get all of the flight segments.
            var segments = flightOffer.offerItems.segments;

            // loop over the segments.
            for (var j = 0; j <= segments.length; j++) {

                // get the current segment
                var flightSegment = segments[j];

                // set the inner html for with the current flight and segment information.
                flightSection.innerHTML = `<div id='${flightOffer.id}'>
                <div>Departure Location: ${flightSegment.departure.iataCode}</div>
                <div>Departure time: ${flightSegment.departure.at}</div>
                <hr />
                <div>Arrival Location: ${flightSegment.arrival.iataCode}</div>
                <div>Arrival time: ${flightSection.arrival.at}</div>
                                        <div>Price per adult: ${totalPrice}</div>
                                        </div>`;

                // add the new flight section to the div in the html
                document.getElementById('flight').append(flightSection);
            }
        }
    }

    const options = {
        fuse_options: {
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


})