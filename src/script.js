//Global variables
let fahrenheitTemperature = null;
let celsiusTemperature = null;
let feelsLike = null;
let windSpeed = null;
let forecastFahrenheitMax = null;
let forecastFahrenheitMin = null;
let apiCurrentResponse = null;

function setApiResponse(response) {
  apiCurrentResponse = response.data;
  updateCurrentContent();
}

function updateCurrentContent() {
  let cityCountry = `${apiCurrentResponse.name}, ${apiCurrentResponse.sys.country}`;
  let cityCountryDisplay = document.querySelector("h1#current-city-display");
  cityCountryDisplay.innerHTML = cityCountry;

  let weatherDescription = apiCurrentResponse.weather[0].description;
  let weatherDescriptionDisplay = document.querySelector(
    "h3#weather-description"
  );
  weatherDescriptionDisplay.innerHTML = weatherDescription;

  let humidity = Math.round(apiCurrentResponse.main.humidity);
  let humidityDisplay = document.querySelector("#humidity");
  humidityDisplay.innerHTML = `HUMIDITY: ${humidity}%`;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `images/${apiCurrentResponse.weather[0].icon}.svg`
  );
  iconElement.setAttribute("alt", apiCurrentResponse.weather[0].description);

  windSpeed = apiCurrentResponse.wind.speed;
  let windSpeedDisplay = document.querySelector("#wind-speed");
  windSpeedDisplay.innerHTML = `WIND: ${Math.round(windSpeed)} mph`;

  //display temperature functions
  getForecast();
  displayFahrenheitTemperature();

  //initial load
  document.querySelector(".loading-icon").style.display = "none";
  document.querySelector(".loader-body").style.display = "block";
}

function getForecast() {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${apiCurrentResponse.coord.lat}&lon=${apiCurrentResponse.coord.lon}&appid=080f1afef2a9a2ea9659284510c483ad&units=imperial`;
  axios.get(forecastApiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastDisplay = document.querySelector("#forecast");
  let forecast = null;
  forecastDisplay.innerHTML = null;
  forecastFahrenheitMax = [];
  forecastFahrenheitMin = [];

  let precipitation = Math.round(response.data.daily[0].pop * 100);
  let chanceOfRainDisplay = document.querySelector("#chance-of-rain");
  chanceOfRainDisplay.innerHTML = `CHANCE OF RAIN: ${precipitation}%`;

  //daily forecast array
  for (let index = 1; index < 7; index++) {
    forecast = response.data.daily[index];
    iconForecastElements = `images/${forecast.weather[0].icon}.svg`;
    forecastDescription = forecast.weather[0].description;
    //push simply adds the next value into the array
    forecastFahrenheitMax.push(response.data.daily[index].temp.max);
    forecastFahrenheitMin.push(response.data.daily[index].temp.min);

    forecastDisplay.innerHTML += `
    <div class="col-2">     
      <h3>
        ${moment(forecast.dt * 1000).format("dddd")}
      </h3>
      <div class="weather-forecast-temperature">
      <img src= "${iconForecastElements}" alt="">
      
      <div id="forecast-temp">
          <span id="max-temp">${Math.round(
            forecast.temp.max
          )}°<span>/<span id="min-temp">${Math.round(forecast.temp.min)}° <span>
      </div>
      <br />
      <div class="forecast-description">
      ${forecastDescription}
      </div>
    </div> 
    `;
  }
}

function displayFahrenheitTemperature() {
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  fahrenheitTemperature = apiCurrentResponse.main.temp;
  fahrenheitFeelsLike = apiCurrentResponse.main.feels_like;

  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = Math.round(fahrenheitTemperature);

  let feelsLikeDisplay = document.querySelector("#feels-like");
  feelsLikeDisplay.innerHTML = `FEELS LIKE: ${Math.round(
    fahrenheitFeelsLike
  )}°`;

  let windSpeedDisplay = document.querySelector("#wind-speed");
  windSpeedDisplay.innerHTML = `WIND: ${Math.round(windSpeed)} mph`;

  let fahrenheitForecastDisplay = document.querySelectorAll("#forecast-temp");
  fahrenheitForecastDisplay.forEach(function (item, index) {
    item.innerHTML = `${Math.round(forecastFahrenheitMax[index])}°`;
  });
}

function updateLocalTime(response) {
  let dateTimeDisplay = document.querySelector("#current-date-time");
  let formattedDate = moment(response.data.location.localtime).format(
    "dddd MMMM Do YYYY, h:mm A"
  );
  dateTimeDisplay.innerHTML = formattedDate;
}

function getGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocalWeather);
}

function getLocalWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=080f1afef2a9a2ea9659284510c483ad`;
  axios.get(url).then(setApiResponse);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = convertToCelcius(fahrenheitTemperature);

  let feelsLikeDisplay = document.querySelector("#feels-like");
  feelsLikeDisplay.innerHTML = `FEELS LIKE: ${convertToCelcius(
    apiCurrentResponse.main.feels_like
  )}°`;

  let windSpeedDisplay = document.querySelector("#wind-speed");
  let windSpeedKM = windSpeed * 1.609;
  windSpeedDisplay.innerHTML = `WIND: ${Math.round(windSpeedKM)} km/h`;

  let celsiusForecastDisplay = document.querySelectorAll("#forecast-temp");
  celsiusForecastDisplay.forEach(function (item, index) {
    item.innerHTML = `${convertToCelcius(forecastFahrenheitMax[index])} /
        ${convertToCelcius(forecastFahrenheitMin[index])}°`;
  });
}

function convertToCelcius(degreesFahrenheit) {
  return Math.round((degreesFahrenheit - 32) * (5 / 9));
}

function handleFahrenheitClick(event) {
  event.preventDefault();
  updateCurrentContent();
}

function searchIconCity(event) {
  event.preventDefault();
  city = event.target.name;
  search(city);
}

function search(city) {
  //calls current weather API
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=080f1afef2a9a2ea9659284510c483ad&units=imperial`;
  axios.get(`${apiUrl}`).then(setApiResponse);

  //calls current time API
  apiUrl = `https://api.weatherstack.com/current?access_key=92cbf662ab2ad251e53851afa1d47ac3&query=${city}`;
  axios.get(`${apiUrl}`).then(updateLocalTime);
}

function handleSubmit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let cityInput = document.querySelector("#city-input");
  let city = cityInput.value;
  cityInput.value = "";
  search(city);
}

let cityInputForm = document.querySelector("#city-input-form");
cityInputForm.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector("#my-location-button");
myLocationButton.addEventListener("click", getGeoLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelciusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", handleFahrenheitClick);

let cityIcons = document.querySelectorAll(".city-icons");
cityIcons.forEach(function (cityIcon) {
  // console.log("adding an event listener for " + cityIcon.name);
  cityIcon.addEventListener("click", searchIconCity);
});

search("Seattle");
