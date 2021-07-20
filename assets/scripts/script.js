var currentCity = "";
const API_KEY = "7f2a300c44e460bbccdcac14620347c7";
//TODO read history from local storage

function handleSearchSubmitButton() {
    let city = $("#city-name-text-area").val().trim();
    processRequest(city);    
}

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

function getFullWeatherData(data) {
    const FULL_WEATHER_URL = `https://api.openweathermap.org/data/2.5/onecall?lon=${data.coord.lon}&lat=${data.coord.lat}&exclude=hourly,minutely,alerts&appid=${API_KEY}&units=imperial`;

    fetch(FULL_WEATHER_URL).then(function(response) {
        return response.json();
    }).then(processFullWeatherData);    
}

function processFullWeatherData(data) {
    printOneDayWeatherData(data);
    printFiveDay(data);   
}

function printOneDayWeatherData(fullWeatherData) {
    $("#cityName").text(currentCity + " " + new Date(fullWeatherData.current.dt * 1000).toLocaleDateString("en-US"));
    $("#temp").text("Temp: " + Math.ceil(fullWeatherData.current.temp) + " F");
    $("#wind").text("Wind " + fullWeatherData.current.wind_speed + " MPH");
    $("#humidity").text("Humidity: " + fullWeatherData.current.humidity + " %");
    let uvIndexValue = fullWeatherData.current.uvi;
    //TODO move to diff function
    let uvIndexBackground = "";
    if (uvIndexValue < 3) {
        uvIndexBackground = "green";
    } else if (uvIndexValue < 6) {
        uvIndexBackground = "yellow";
    } else if (uvIndexValue < 8) {
        uvIndexBackground = "orange";
    } else {
        uvIndexBackground = "red";
    }
    $("#uvindex").text("UVI: " + fullWeatherData.current.uvi).removeClass().addClass(uvIndexBackground);
    $("#daily-icon").attr("src", `https://openweathermap.org/img/wn/${fullWeatherData.current.weather[0].icon}.png`);
    $(".display-area").removeAttr('hidden');
}

function printFiveDay(fullWeatherData) {
    //five-day-card-section
    //create all cards and append to the fivedaycardsection
    $('.five-day-card-section').empty();
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

function historyButtonOnclick(event) {
    processRequest(event.currentTarget.id);
}

updateSearchHistory();
processRequest(currentCity);