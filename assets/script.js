const api = "04cfc26e70fc446a9dc26c29fb9e8eac";
var Base_URL = "https://api.openweathermap.org/data/2.5/forecast?";
var uvi_URL = "https://api.openweathermap.org/data/2.5/onecall?";
var inputBox = document.getElementById("cityInput");
var btn = document.getElementById("button-addon2");
var currentWeatherEl = document.getElementById("weatherContainer");
var buttonStorageEl = document.getElementById("ButtonStorage");
var forecastEl = document.getElementById("fiveDForecast");
var clrBtn = document.getElementById("deleteBtn");
var cityArray = [];

// sort dupes out
// //load last city searched on start
// window.onload= function(){
// }

if (
  localStorage.getItem("city") == null ||
  localStorage.getItem("city").length === 0
) {
  console.log("empty");
} else {
  //on page load renders last inputed city
  cityArray = localStorage.getItem("city");
  cityArray = JSON.parse(cityArray);
  var arrLength = cityArray.length;
  var lastCity = cityArray[arrLength - 1];
  fetchweather(lastCity);
  var storedCity = localStorage.getItem("city");
  storedCity = JSON.parse(storedCity);
  // loops through city array and displays
  for (var c = 0; c < storedCity.length; c++) {
    var pastBtn = document.createElement("button");
    buttonStorageEl.appendChild(pastBtn);
    pastBtn.addEventListener("click", setcityToText);
    pastBtn.innerText = storedCity[c];
  }
}
clrBtn.onclick = function () {
  localStorage.removeItem("city");
  buttonStorageEl = "";
};

btn.onclick = function (e) {
  var inputedCity = inputBox.value;
  console.log(e);
  cityArray.push(inputedCity);
  fetchweather(inputedCity);
  localStorage.setItem("city", JSON.stringify(cityArray));
  addPrevBtn(inputedCity);
};
function fetchweather(city) {
  currentWeatherEl.innerHTML = "";
  forecastEl.innerHTML = "";
  var queryParams = new URLSearchParams({
    appid: api,
    q: city,
  });
  fetch(Base_URL + queryParams)
    .then((response) => response.json())
    .then((response) => {
      console.log("response from fetch weather");
      console.log(response);
      fetchUVI(response, city);
    });
}
function fetchUVI(response, city) {
  var queryParams = new URLSearchParams({
    appid: api,
    lat: response.city.coord.lat,
    lon: response.city.coord.lon,
  });

  fetch(uvi_URL + queryParams)
    .then((response) => response.json())
    .then((response) => {
      console.log("fetch current and forecast");
      console.log(response);
      renderWeather(response, city);

      for (var i = 1; i < 6; i++) {
        var currentDay = response.daily[i];
        renderForecast(currentDay);
      }
    });
}
function renderWeather(response, city) {
  var cityName = document.createElement("h2");
  var weatherList = document.createElement("ul");
  var tempLi = document.createElement("li");
  var windLi = document.createElement("li");
  var UVLi = document.createElement("li");
  var humidityLi = document.createElement("li");
  var currentDt =
    city + " " + moment.utc(response.current.dt * 1000).format("L");

  cityName.innerHTML = currentDt + " " + response.current.weather[0].description;
  currentWeatherEl.appendChild(cityName);
  currentWeatherEl.appendChild(weatherList);
  weatherList.appendChild(tempLi);
  weatherList.appendChild(windLi);
  weatherList.appendChild(UVLi);
  weatherList.appendChild(humidityLi);

  tempLi.innerText =
    "Temp: " + (response.current.temp * 1.8 - 459.67).toFixed(2) + "F°";
  windLi.innerText =
    "Wind Spd: " + (response.current.wind_speed * 2.24).toFixed(2) + "MPH";
  UVLi.innerText = "UVI: " + response.current.uvi + "°";
  humidityLi.innerText = "Humidity: " + response.current.humidity + "%";
  if (response.current.uvi < 3) {
    UVLi.className = "green";
  } else if (response.current.uvi < 6) {
    UVLi.className = "yellow";
  } else if (response.current.uvi < 8) {
    UVLi.className = "orange";
  } else if (response.current.uvi < 11) {
    UVLi.className = "red";
  } else if (response.current.uvi > 10) {
    UVLi.className = "purple";
  }
}

function renderForecast(currentDay) {
  var weatherList = document.createElement("ul");
  var dateLi = document.createElement("li");
  var precipitationLi = document.createElement("li");
  var tempLi = document.createElement("li");
  var windLi = document.createElement("li");
  var humidityLi = document.createElement("li");
  var UVLi = document.createElement("li");

  forecastEl.appendChild(weatherList);

  weatherList.appendChild(dateLi);
  weatherList.appendChild(precipitationLi);
  weatherList.appendChild(tempLi);
  weatherList.appendChild(windLi);
  weatherList.appendChild(humidityLi);
  weatherList.appendChild(UVLi);

  // moment.js the date
  dateLi.innerText = moment.utc(currentDay.dt * 1000).format("L");
  tempLi.innerText =
    "Temp: " + (currentDay.temp.day * 1.8 - 459.67).toFixed(2) + "F°";
  precipitationLi.innerText = currentDay.weather[0].description;
  windLi.innerText =
    "Wind Spd: " + (currentDay.wind_speed * 2.24).toFixed(2) + "MPH";
  humidityLi.innerText = "Humidity: " + currentDay.humidity + "%";
  UVLi.innerText = "UVI: " + currentDay.uvi + "°";
  if (currentDay.uvi < 3) {
    UVLi.className = "green";
  } else if (currentDay.uvi < 6) {
    UVLi.className = "yellow";
  } else if (currentDay.uvi < 8) {
    UVLi.className = "orange";
  } else if (currentDay.uvi < 11) {
    UVLi.className = "red";
  } else if (currentDay.uvi > 10) {
    UVLi.className = "purple";
  }
}

function addPrevBtn(inputedCity) {
  var pastInput = document.createElement("button");
  pastInput.addEventListener("click", setcityToText);
  buttonStorageEl.appendChild(pastInput);
  pastInput.innerText = inputedCity;
}

function setcityToText(e) {
  var pastCity = e.target.innerText;
  console.log(pastCity);
  fetchweather(pastCity);
}
