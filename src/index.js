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

  getForecast(response.data.city);
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

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[date.getDay()];
}

function getForecast(city) {
  let apiKey = "93ffacd3347f947bo5021d6t7b18ceab";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecast);
}

function displayForecast(response) {
  let forecastHtml = "";

  response.data.daily.forEach(function (day, index) {
    if (index < 5) {
      forecastHtml =
        forecastHtml +
        `
  <div class="weather-forecast-day">
    <div class="weather-forecast-date">${formatDay(day.time)}</div>
    <div>
    <img src="${day.condition.icon_url}"
    class="weather-forecast-icon" />
    </div>
    <div class="weather-forecast-temperatures">
      <span class="forecast-high">${Math.round(day.temperature.maximum)}°</span>
      <span class="forecast-low">${Math.round(day.temperature.minimum)}°</span>
    </div>
  </div>
`;
    }
  });
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = forecastHtml;
}

let geocode = {
  reverseGeocode: function (latitude, longitude) {
    var api_key = "1e51b4c01410458d8db77a8760a506bf";
    var query = latitude + "," + longitude;
    var api_url = "https://api.opencagedata.com/geocode/v1/json";

    var request_url =
      api_url +
      "?" +
      "key=" +
      api_key +
      "&q=" +
      encodeURIComponent(query) +
      "&pretty=1" +
      "&no_annotations=1";

    var request = new XMLHttpRequest();
    request.open("GET", request_url, true);

    request.onload = function () {
      let currentLocation = document.querySelector("#current-location");

      if (request.status === 200) {
        var data = JSON.parse(request.responseText);
        let userCity = data.results[0].components.city;
        searchCity(userCity);
        currentLocation.innerHTML = userCity;
      } else if (request.status <= 500) {
        console.log("unable to geocode! Response code: " + request.status);
        var data = JSON.parse(request.responseText);
        console.log("error msg: " + data.status.message);
        currentLocation.innerHTML = "Unable to locate";
      } else {
        searchCity("Los Angeles");
      }
    };

    request.onerror = function () {
      console.log("unable to connect to server");
    };

    request.send();
  },
  getLocation: function () {
    function success(data) {
      geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
    }
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, console.error);
    } else {
      searchCity("Los Angeles");
    }
  },
};

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchInput);

geocode.getLocation();
