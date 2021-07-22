/*
    global variables and constants
*/
let currentCity = "";
const API_KEY = "7f2a300c44e460bbccdcac14620347c7";

/*
    Function: handleSearchSubmitButton
    Purpose: handles the click event for the search button
    Input: none
    return: none
*/
function handleSearchSubmitButton() {
    let city = $("#city-name-text-area").val().trim();
    $("#city-name-text-area").val("");
    processRequest(city);    
}

/*
    Function: processRequest
    Purpose: using fetch, it will call an api to get the lon/lat coordinates of the input city. If invalid city, the user will be resented with an alert. If the city is valid it will be added to the history 
    Input: city - string representing the city name to search the weather for
    return: none
*/
function processRequest(city) {
    const COORD_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=" +city +  "&appid=" + API_KEY;
    //get coordinates 
    fetch(COORD_API_URL).then(function(response) {
        if (response.ok) {
            currentCity = city;
            updateSearchHistory(city);
            return response.json();
        }
    }).then (getFullWeatherData)
    .catch(function(error) {
        alert("Invalid City");
      });
}

/*
    Function: getFullWeatherData
    Purpose: calls the onecall api to get full weather data for a location. The location is a lon/lat values that are passed as part of the input
    input: data - a json object that is the result of the call to the weather api.
    returns: none
*/
function getFullWeatherData(data) {
    const FULL_WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lon=${data.coord.lon}&lat=${data.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;

    fetch(FULL_WEATHER_URL).then(function(response) {
        return response.json();
    }).then(processFullWeatherData);    
}

/*
    Function: processFullWeatherData
    purpose: processes the full weather data by calling functions to print the daily and five-day forecast
    input: data - json representing the full weather data returned by the onecall api
    return: none
*/
function processFullWeatherData(data) {
    printOneDayWeatherData(data);
    printFiveDay(data);   
}

/*
    Function: printOneDayWeatherData
    Purpose: prints out all the current day weather data (temp, wind, humidity, UVI, and temp icon)
    input: array representing the full weather data
    return: null
*/
function printOneDayWeatherData(fullWeatherData) {
    $("#cityName").text(currentCity + " " + new Date(fullWeatherData.current.dt * 1000).toLocaleDateString("en-US"));
    $("#temp").text("Temp: " + Math.ceil(fullWeatherData.current.temp) + " F");
    $("#wind").text("Wind " + fullWeatherData.current.wind_speed + " MPH");
    $("#humidity").text("Humidity: " + fullWeatherData.current.humidity + " %");

    let uvIndexBackground = getUVIColor(fullWeatherData.current.uvi);

    $("#uvindex").text("UVI: " + fullWeatherData.current.uvi).removeClass().addClass(uvIndexBackground);
    $("#daily-icon").attr("src", `https://openweathermap.org/img/wn/${fullWeatherData.current.weather[0].icon}.png`);
    $(".display-area").removeAttr('hidden');
}

/*
    Function getUVIColor
    Purpose: determines the color code to use for a UVI index level
    input: uviReading a value representing the UVI index
    returns: color code for the corresponding uviReading
*/
function getUVIColor(uviReading) {
    if (uviReading < 3) {
        return "green";
    } else if (uviReading < 6) {
        return "yellow";
    } else if (uviReading < 8) {
        return "orange";
    } else {
        return "red";
    }
}

/*
    Function: printFiveDay 
    Purpose: attaches cards for the five day weather forecast 
    input: fullWeatherData a json returned by the one weather api call
    return: none
*/
function printFiveDay(fullWeatherData) {

    //empty the current five-day-card-section 
    $('.five-day-card-section').empty();
    //start from index 1 because 0 is the current day temp
    for (let i = 1; i < 6; i++) {
        //create card class
        let cardDiv = $("<div></div>");
        cardDiv.addClass("card col-xl col-lg-5  m-1");
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
        //create wind list item
        let windLi = $("<li/>").attr("id", `5day-${i}-wind`).text("Wind: " + fullWeatherData.daily[i].wind_speed + " MPH");
        //create humidity    
        let humidityLi = $("<li/>").attr("id", `5day-${i}-humidity`).text("Humidity: " + fullWeatherData.daily[i].humidity + " %")
        
        fiveDayUl.append(tempratureLi, windLi, humidityLi);
       
        //attach divs to card
        headerDiv.append(cardTitle, cardIcon);
        cardBody.append(fiveDayUl);
        cardDiv.append(headerDiv);
        cardDiv.append(cardBody);
        //attach card to section
        $('.five-day-card-section').append(cardDiv);
    } 
}

/*
    Function: updateSearchHistory
    Purpose: updates the search history by adding the new city and writing the new list to the local storage. New city is added to the front of the list
    Input: city - the city to add to history
    return: none
*/
function updateSearchHistory(city) {
    $('#search-history-ul').empty();
    let searchHistoryArray =  JSON.parse(localStorage.getItem("searchHistoryArray")) || [];
    if (city == undefined) {
        city = searchHistoryArray[0];
        currentCity = city;
    }
    city = city.toLowerCase();
    console.log(city);

    if (!searchHistoryArray.includes(city)){
        searchHistoryArray.unshift(city);
    } else {
        let cityIndex = searchHistoryArray.indexOf(city);
        searchHistoryArray.splice(cityIndex, 1);
        searchHistoryArray.unshift(city);
    }
    for (let i = 0; i < searchHistoryArray.length; i++) {
        let cityButton = $("<button/>").addClass("btn btn-outline-secondary col my-1 city-name").attr("id", searchHistoryArray[i]).click(historyButtonOnclick).text(searchHistoryArray[i]);
        let listItem = $("<li/>");
        listItem.append(cityButton);
        $('#search-history-ul').append(listItem);
    }
    
    localStorage.setItem("searchHistoryArray", JSON.stringify(searchHistoryArray));
    
}

/*
    Function: historyButtonOnClick 
    Purpose: handles the button clicks on all the search history buttons
    input: the event that generated the call
    return: none
*/
function historyButtonOnclick(event) {
    processRequest(event.currentTarget.id);
}

//load the search history on initial launch
updateSearchHistory();
//show the last searched city by default
processRequest(currentCity);