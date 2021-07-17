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

const currentDayDisplayDiv = $("")
var currentCity = "Seattle";


function handleSearchSubmitButton() {
    let city = $("#city-name-text-area").val().trim();
    getFullWeatherDataFromAPI(city);
    addCityToSearchHistory(city);
}

function buildQueryURL(city) {
    const API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";
    const API_FIVE_DAY_URL = "https://api.openweathermap.org/data/2.5/forecast?q=";
    const API_ONE_CALL =  "https://api.openweathermap.org/data/2.5/onecall?lon=-122.335167&lat=47.608013&exclude=hourly,minutely"
    const API_KEY = "7f2a300c44e460bbccdcac14620347c7";
    const APPID_QUERY_PARAM = "&appid=";
    const TEMP_QUERY_PARAM = "&units=imperial";
    return API_ONE_CALL +  APPID_QUERY_PARAM + API_KEY + TEMP_QUERY_PARAM ;
}
function getCityLongLat(city) {

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





