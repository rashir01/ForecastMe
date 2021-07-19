/*
todo: 
1. create the landing and search in HTML
    1.1 optional show current location weather
    1.2 optional add suggestion to cities
    1.3 add header --DONE
    1.4 optional add footer 
    1.5 add search field 
        1.5.1 suggestions
        1.5.2 set search field default text --DONE
    1.6 add search button --DONE

2. Search for a city 
    2.1 optional show suggested cities
    2.2 capture city input --DONE

3. get weather for city being searched
4. add weather to display 
    4.1 add display date and current state of the weather icon (sunny, cloudy, etc)
    4.2 add wind speed display 
    4.3 add humidity display
    4.4 add uv index display 
    4.5 add uv index display colore code
    4.6 add 5 day forcast
    4.6 optional addd toggle for C/F 
5. add search history 
    5.1 implement ability to click button and populate the weather data
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
}

function processRequest(city) {
    city = "Seattle";
    console.log("welcome to process request " + city )
    const COORD_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" +city +  "&appid=" + API_KEY;
    fetch(COORD_API_URL).then(function(response) {
        return response.json();
    }).then (getFullWeatherData)
    .then (printWeatherData);
    /*
        1. get coordinates
        2. get full week data
        3. print 1 day 
        4. print uv 
        5. print 5 day
        6. add to history
    */
}

function printWeatherData(fullWeatherData) {
    console.log(fullWeatherData);
}
function getFullWeatherData(data) {
    const FULL_WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lon=${data.coord.lon}&lat=${data.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;
    console.log(`inside of fullWeather data and api is ${FULL_WEATHER_URL}`)
    console.log(data);
    fetch(FULL_WEATHER_URL).then(function(response) {
        return response.json();
    }).then(printWeatherData)
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




