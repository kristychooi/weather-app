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
  let city = `${response.data.name}, ${response.data.sys.country}`;
  let cityDisplay = document.querySelector("h1#current-city-display");
  cityDisplay.innerHTML = city;

  let dateTimeDisplay = document.querySelector("#current-date-time");
  let formattedDate = formatDate(response.data.dt * 1000);
  dateTimeDisplay.innerHTML = formattedDate;

  let temperature = Math.round(response.data.main.temp);
  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = temperature;

  fahrenheitTemperature = response.data.main.temp;

  let weatherDescription = response.data.weather[0].description;
  let weatherDescriptionDisplay = document.querySelector(
    "h3#weather-description"
  );
  weatherDescriptionDisplay.innerHTML = weatherDescription;

  let feelsLikeDisplay = document.querySelector("#feels-like");
  let feelsLike = `FEELS LIKE: ${Math.round(response.data.main.feels_like)}°`;
  feelsLikeDisplay.innerHTML = feelsLike;

  let windSpeed = `WIND: ${Math.round(response.data.wind.speed)} mph`;
  let windSpeedDisplay = document.querySelector("#wind-speed");
  windSpeedDisplay.innerHTML = windSpeed;

  let humidity = `HUMIDITY: ${Math.round(response.data.main.humidity)}%`;
  let humidityDisplay = document.querySelector("#humidity");
  humidityDisplay.innerHTML = humidity;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function updateForecast(response) {
  let forecastDisplay = document.querySelector("#forecast");
  let forecast = null;
  forecastDisplay.innerHTML = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastDisplay.innerHTML += `
    <div class="col-2">     
      <h3>
        ${formatHours(forecast.dt * 1000)}
      </h3>
      <div class="weather-forecast-temperature">
      <img src= "http://openweathermap.org/img/wn/${
        forecast.weather[0].icon
      }@2x.png" alt="">
          ${Math.round(forecast.main.temp_max)}° 
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
  let feelsLikeCelcius = (40 - 32) * (5 / 9); //how do I get response from within this function?
  feelsLikeDisplay.innerHTML = `FEELS LIKE: ${Math.round(feelsLikeCelcius)}°`;
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");

  let temperatureDisplay = document.querySelector("h2#current-temp");
  temperatureDisplay.innerHTML = Math.round(fahrenheitTemperature);
}

//Global variables
let fahrenheitTemperature = null;
let celsiusTemperature = null;
// let feelsLike = null;

let cityInputForm = document.querySelector("#city-input-form");
cityInputForm.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector("#my-location-button");
myLocationButton.addEventListener("click", getGeoLocation);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelciusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("New York");
