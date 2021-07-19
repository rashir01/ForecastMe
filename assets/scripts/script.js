/*
todo: 
1. create the landing and search in HTML
    1.1 optional show current location weather
    1.2 optional add suggestion to cities
    1.3 add header --DONE
    1.4 optional add footer 
    1.5 add search field 
        1.5.1 optional suggestions
        1.5.2 set search field default text --DONE
    1.6 add search button --DONE

2. Search for a city 
    2.1 optional show suggested cities
    2.2 capture city input --DONE

3. get weather for city being searched --DONE
    3.1 get lon/lat --DONE
    3.2 get full weather data --DONE 
4. add weather to display 
    4.1 add display date and current state of the weather icon (sunny, cloudy, etc) --DONE
    4.2 add wind speed display --DONE
    4.3 add humidity display --DONE
    4.4 add uv index display --DONE
    4.5 add uv index display colore code
    4.6 add 5 day forcast
    4.6 optional addd toggle for C/F 
5. add search history 
    5.1 implement ability to click button and populate the weather data --DONE
    5.2 optional: add remove history city option
    5.3 save searched cities
        5.3.1 handle invalid cities
        5.3.2 persist saved cities
6. create CSS 
    6.1 add top header //DONE
    6.2 add search area
    6.3 add 5 day forcast
    6.4 add 1 day forcas
        6.4.1 remove ul bullets
*/

var currentCity = "";
const API_KEY = "7f2a300c44e460bbccdcac14620347c7";

function handleSearchSubmitButton() {
    let city = $("#city-name-text-area").val().trim();
    processRequest(city);
    currentCity = city;
}

function processRequest(city) {
    console.log("welcome to process request " + city )
    const COORD_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" +city +  "&appid=" + API_KEY;
    //get coordinates 
    fetch(COORD_API_URL).then(function(response) {
        return response.json();
    }).then (getFullWeatherData)
}

function printWeatherData(fullWeatherData) {
    console.log(fullWeatherData);
    console.log("inside print weather data");
    $("#cityName").text(currentCity + " " + new Date(fullWeatherData.current.dt * 1000).toLocaleDateString("en-US"));
    $("#temp").text("Temp: " + Math.ceil(fullWeatherData.current.temp) + " F");
    $("#wind").text("Wind " + fullWeatherData.current.wind_speed + " MPH");
    $("#humidity").text("Humidity: " + fullWeatherData.current.humidity + " %");
    $("#uvindex").text("UVI: " + fullWeatherData.current.uvi);
    $("#daily-icon").attr("src", `https://openweathermap.org/img/wn/${fullWeatherData.current.weather[0].icon}.png`);
    $(".display-area").removeAttr('hidden');
}


function printFiveDay(fullWeatherData) {
    //five-day-card-section
    //create all cards and append to the fivedaycardsection
    console.log("inside print 5 day");
    $('.five-day-card-section').empty();
    for (let i = 1; i < 6; i++) {
        //create card class
        let cardDiv = $("<div></div>");
        cardDiv.addClass("card");
            let headerDiv = $("<div></div>");
            //create date header
            let cardTitle = $("<h4></h4>");
            cardTitle.attr("id", `5day-${i}-header`);
            cardTitle.addClass("card-header");
            cardTitle.text(new Date(fullWeatherData.daily[i].dt * 1000).toLocaleDateString("en-US"))
            //create img icon
            let cardIcon = $("<img>");
            cardIcon.attr("id", `5day-${i}-daily-icon`);
            cardIcon.attr("src", `https://openweathermap.org/img/wn/${fullWeatherData.daily[i].weather[0].icon}.png`)
            //create div for card body
            let cardBody = $("<div></div>");
            cardBody.addClass("card-body");
            let fiveDayUl = $("<ul></ul");
            //create temp list item
            let tempratureLi = $("<li/>").attr("id", `5day-${i}-temp`).text("Temp: " + Math.ceil(fullWeatherData.daily[i].temp.day) + " F");
            //fiveDayUl.append(tempratureLi);
            //create wind list item
            let windLi = $("<li/>").attr("id", `5day-${i}-wind`).text("Wind: " + fullWeatherData.daily[i].wind_speed + " MPH");
            //fiveDayUl.append(windLi);
            //create humidity    
            let humidityLi = $("<li/>").attr("id", `5day-${i}-humidity`).text("Humidity: " + fullWeatherData.daily[i].humidity + " %")
            
            fiveDayUl.append(tempratureLi, windLi, humidityLi);
                
                
        //attach divs to card
        //attach card to section
        headerDiv.append(cardTitle, cardIcon);
        cardBody.append(fiveDayUl);
        cardDiv.append(headerDiv);
        cardDiv.append(cardBody);
        
        $('.five-day-card-section').append(cardDiv);
    }
    // $("#5day-1-header").text(new Date(fullWeatherData.daily[1].dt * 1000).toLocaleDateString("en-US"));
    // $("#5day-1-daily-icon").attr("src", `https://openweathermap.org/img/wn/${fullWeatherData.daily[1].weather[0].icon}.png`);
    // $("#5day-1-temp").text("Temp: " + Math.ceil(fullWeatherData.daily[1].temp.day) + " F");
    // $("#5day-1-wind").text("Wind: " + fullWeatherData.daily[1].wind_speed + " MPH");
    // $("#5day-1-humidity").text("Humidity: " + fullWeatherData.daily[1].humidity + " %");
}

function getFullWeatherData(data) {
    const FULL_WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lon=${data.coord.lon}&lat=${data.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;

    fetch(FULL_WEATHER_URL).then(function(response) {
        return response.json();
    }).then(processFullWeatherData);//replace these two with process weather data that calls each function individually
    
}

function processFullWeatherData(data) {
    printWeatherData(data);
    printFiveDay(data);
}
/*function handleAPICalls(city) {
    const COORD_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" +city +  "&appid=" + API_KEY;
    const FULL_WEATHER_URL = 
    fetch(COORD_API_URL).then(function(response) {
        return response.json();
    }).then (function (coordiatesJSON) {
        const FULL_WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lon=${coordiatesJSON.coord.lon}&lat=${coordiatesJSON.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;
        fetch(FULL_WEATHER_URL).then(function(fullWeatherDataRaw) {
            return fullWeatherDataRaw.json();
        })
        return coordiatesJSON;
    })






    .then (printCurrentDayTemps).
    then(getUVI);
}

function printCurrentDayTemps(data) {
    //let temp = data.main.temp;
    //get current icon
    //let icon = data.weather[0].icon; 
    //get current humidity
    //let humidity = data.main.humidity;
    //get current wind speed
    //let windspeed = data.wind.speed;
    //get uvi
    // getUVI(data).then(function() {
    //     console.log (`temp ${temp} icon ${icon} humidity ${humidity} windspeed ${windspeed}`);
    // });
        
        console.log(`this is current day temps ${data}`);
    
    return data;
}

function getUVI(data) {
    // let apiQuery = `https://api.openweathermap.org/data/2.5/onecall?lon=${data.coord.lon}&lat=${data.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;
    // fetch(apiQuery).then(function(response) {
    //     return response.json();
    // })
    // .then(function(data) {
         console.log(`uvi ${data}`);
         return data;
    // });

}

//use the current api to get long/lat
//use long/lat to do onecall
//display temps from onecall


/*
function buildQueryURL(city) {
    const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
    const API_FIVE_DAY_URL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const API_ONE_CALL =  "https://api.openweathermap.org/data/2.5/onecall?lon=-122.335167&lat=47.608013&exclude=hourly,minutely,alerts"
    const APPID_QUERY_PARAM = "&appid=" + API_KEY;
    const TEMP_QUERY_PARAM = "&units=imperial";
    return API_ONE_CALL +  APPID_QUERY_PARAM  + TEMP_QUERY_PARAM ;
}


function addCityToSearchHistory(city) {}
function getFullWeatherDataFromAPI(city) {
    fetch(buildQueryURL(city))
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Fetch Response \n-------------');
      //console.log(data);
      console.log(data);
      if (!data) {
        
        //return error
        console.log("haha i caught it");
      } else {
          //return the data
          processData(data);
      }
    });
}

//todo implement the uvindex function
function setUVIndexBackground(uvindex) {}

function processData(data){
    populateCurrentDayData(data);
}
function populateCurrentDayData(data){
    console.log(data);
    $("#cityName").text("Seattle " + new Date(data.current.dt * 1000).toLocaleDateString("en-US"));
    $("#temp").text(Math.ceil(data.current.temp) + " F");
    $("#wind").text(data.current.wind_speed + " MPH");
    $("#humidity").text(data.current.humidity + " %");
    $("#uvindex").text(data.current.uvi);
    let temp = "04d"
    $("#daily-icon").attr("src", `https://openweathermap.org/img/wn/${data.current.weather[0].icon}.png`)
    //
    setUVIndexBackground(data.current.uvi);
}
*/




