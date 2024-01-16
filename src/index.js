function updateWeather(response) {
  let temperatureElement = document.querySelector("#temperature");
  let temperature = response.data.temperature.current;
  let cityElement = document.querySelector("#city");
  let conditionELement = document.querySelector("#current-condition");
  let date = new Date();
  let timeElement = document.querySelector("#current-time");
  let amPm = date.toLocaleTimeString([], { timeStyle: "short" });
  let dayElement = document.querySelector("#current-day");
  let icon = document.querySelector("#current-weather-icon");
  let humidity = response.data.temperature.humidity;
  let humidityElement = document.querySelector("#humidity");
  let windSpeedKm = response.data.wind.speed;
  let windSpeedElement = document.querySelector("#wind-speed");
  let windSpeedMph = (windSpeedKm * 0.6213712).toFixed(2);

  temperatureElement.innerHTML = Math.round(temperature);
  cityElement.innerHTML = response.data.city;
  conditionELement.innerHTML = response.data.condition.description;
  timeElement.innerHTML = amPm;
  dayElement.innerHTML = formatDate(date);
  icon.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;
  humidityElement.innerHTML = `${humidity}%`;
  windSpeedElement.innerHTML = `${windSpeedMph} mph`;
}

function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[date.getDay()];

  return day;
}

function searchCity(city) {
  let apiKey = "93ffacd3347f947bo5021d6t7b18ceab";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(updateWeather);
}

function handleSearchInput(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search-form-input");
  searchCity(searchInput.value);
}

function displayForecast() {
  let days = ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  let forecastHtml = "";

  days.forEach(function (day) {
    forecastHtml =
      forecastHtml +
      `
  <div class="weather-forecast-day">
    <div class="weather-forecast-date">${day}</div>
    <div class="weather-forecast-icon">🌤</div>
    <div class="weather-forecast-temperatures">
      <span class="forecast-high">66°</span>
      <span class="forecast-low">44°</span>
    </div>
  </div>
`;
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchInput);

searchCity("Los Angeles");
displayForecast();
