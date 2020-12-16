//Global variables
let fahrenheitTemperature = null;
let celsiusTemperature = null;
let feelsLike = null;
let windSpeed = null;
let forecastFahrenheit = null;
let apiCurrentResponse = null;

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let currentDay = days[date.getDay()];
  let currentMinute = date.getMinutes();
  if (currentMinute < 10) {
    currentMinute = `0${currentMinute}`;
  }
  let currentHour = date.getHours();
  if (currentHour >= 12) {
    ampm = "PM";
  } else {
    ampm = "AM";
  }
  currentHour = currentHour % 12;
  return `${currentDay} ${currentHour}:${currentMinute} ${ampm}`;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let hours = date.getHours();

  if (hours >= 12) {
    ampm = "pm";
  } else {
    ampm = "am";
  }
  hours = hours % 12;

  return `${hours}:${minutes}${ampm}`;
}

function updateCurrentContent(response) {
  console.log(response);
  apiCurrentResponse = response.data;

  let city = `${apiCurrentResponse.name}, ${apiCurrentResponse.sys.country}`;
  let cityDisplay = document.querySelector("h1#current-city-display");
  cityDisplay.innerHTML = city;

  let dateTimeDisplay = document.querySelector("#current-date-time");
  let formattedDate = formatDate(apiCurrentResponse.dt * 1000);
  dateTimeDisplay.innerHTML = formattedDate;

  let temperature = Math.round(apiCurrentResponse.main.temp);
  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = temperature;

  fahrenheitTemperature = apiCurrentResponse.main.temp;

  let weatherDescription = apiCurrentResponse.weather[0].description;
  let weatherDescriptionDisplay = document.querySelector(
    "h3#weather-description"
  );
  weatherDescriptionDisplay.innerHTML = weatherDescription;

  let feelsLikeDisplay = document.querySelector("#feels-like");
  feelsLike = apiCurrentResponse.main.feels_like;
  feelsLikeDisplay.innerHTML = `FEELS LIKE: ${Math.round(feelsLike)}°`;

  fahrenheitFeelsLike = apiCurrentResponse.main.feels_like;

  let windSpeedDisplay = document.querySelector("#wind-speed");
  windSpeed = apiCurrentResponse.wind.speed;
  windSpeedDisplay.innerHTML = `WIND: ${Math.round(windSpeed)} mph`;

  windspeedKM = apiCurrentResponse.wind.speed;

  let humidity = `HUMIDITY: ${Math.round(apiCurrentResponse.main.humidity)}%`;
  let humidityDisplay = document.querySelector("#humidity");
  humidityDisplay.innerHTML = humidity;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `images/${apiCurrentResponse.weather[0].icon}.svg`
  );
  iconElement.setAttribute("alt", apiCurrentResponse.weather[0].description);
}

function updateForecast(response) {
  let forecastDisplay = document.querySelector("#forecast");
  let forecast = null;
  forecastDisplay.innerHTML = null;
  forecastFahrenheit = [];

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    iconForecastElements = `images/${response.data.list[index].weather[0].icon}.svg`;
    forecastDescription = response.data.list[index].weather[0].description;
    forecastFahrenheit[index] = forecast.main.temp_max;

    forecastDisplay.innerHTML += `
    <div class="col-2">     
      <h3>
        ${formatHours(forecast.dt * 1000)}
      </h3>
      <div class="weather-forecast-temperature">
      <img src= "${iconForecastElements}" alt="">
      
      <div id="forecast-temp">
          ${Math.round(forecast.main.temp_max)}° 
      </div>
      <br />
      <div class="forecast-description">
      ${forecastDescription}
      </div>
    </div> 
    `;
  }
}

function search(city) {
  let apiKey = "080f1afef2a9a2ea9659284510c483ad";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateCurrentContent);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(`${apiUrl}`).then(updateForecast);
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

function getLocalWeather(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let units = "imperial";
  let apiKey = "080f1afef2a9a2ea9659284510c483ad";
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(url).then(updateContent);
}

function getGeoLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(getLocalWeather);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  fahrenheitLink.classList.remove("active");
  celsiusLink.classList.add("active");

  let celsiusTemperature = (fahrenheitTemperature - 32) * (5 / 9);
  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = Math.round(celsiusTemperature);

  let feelsLikeDisplay = document.querySelector("#feels-like");
  let feelsLikeCelcius = (feelsLike - 32) * (5 / 9);
  feelsLikeDisplay.innerHTML = `FEELS LIKE: ${Math.round(feelsLikeCelcius)}°`;

  let windSpeedDisplay = document.querySelector("#wind-speed");
  let windSpeedKM = windSpeed * 1.609;
  windSpeedDisplay.innerHTML = `WIND: ${Math.round(windSpeedKM)} km/h`;

  let celsiusForecastDisplay = document.querySelectorAll("#forecast-temp");
  celsiusForecastDisplay.forEach(function (item, index) {
    item.innerHTML = `${Math.round(
      (forecastFahrenheit[index] - 32) * (5 / 9)
    )}°`;
  });
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

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
    item.innerHTML = `${Math.round(forecastFahrenheit[index])}°`;
  });
}

function searchSeattle() {
  city = "Seattle";
  search(city);
}

function searchSydney() {
  city = "Sydney";
  search(city);
}

function searchParis() {
  city = "Paris";
  search(city);
}

function searchNewYork() {
  city = "New York";
  search(city);
}

function searchLondon() {
  city = "London";
  search(city);
}

let cityInputForm = document.querySelector("#city-input-form");
cityInputForm.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector("#my-location-button");
myLocationButton.addEventListener("click", getGeoLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelciusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

let seattleIcon = document.querySelector("#seattle-icon");
seattleIcon.addEventListener("click", searchSeattle);

let sydneyIcon = document.querySelector("#sydney-icon");
sydneyIcon.addEventListener("click", searchSydney);

let parisIcon = document.querySelector("#paris-icon");
parisIcon.addEventListener("click", searchParis);

let newyorkIcon = document.querySelector("#newyork-icon");
newyorkIcon.addEventListener("click", searchNewYork);

let londonIcon = document.querySelector("#london-icon");
londonIcon.addEventListener("click", searchLondon);

search("New York");
