const API_KEY = "36ce6e444ccdccbe388d184c5b4b92e8";

async function fetchCityCoordinates(cityName) {
  const respone = await fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
  );
  const json = await respone.json();
  console.log(json);
  return {
    lat: json[0].lat,
    lon: json[0].lon,
  };
}

async function fetchWeatherData(coordinates) {
  const respone = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`
  );
  const json = await respone.json();
  return json;
}

function getWeatherObject(weatherData) {
  return {
    temp: weatherData.main.temp,
    feels_like: weatherData.main.feels_like,
    cityName: weatherData.name,
    weatherDescription: weatherData.weather[0].description,
    iconId: weatherData.weather[0].icon,
  };
}

const WeatherDisplayController = (function () {
  const cityNameField = document.querySelector("#city-name");
  const descriptionField = document.querySelector("#weather-description");
  const tempField = document.querySelector("#temp");
  const feelsLikeField = document.querySelector("#feels-like");
  const weatherIcon = document.querySelector("#weather-icon");

  const tempUnits = document.querySelectorAll(".temp-unit");

  const cityInput = document.querySelector("#city-input");
  const searchBtn = document.querySelector("#search-btn");
  const toggleTempUnit = document.querySelector("#toggle-temp");

  let weatherUnit = {
    name: "celsius",
    symbol: "°C",
  };

  const displayWeather = (weatherObj) => {
    cityNameField.textContent = weatherObj.cityName;
    descriptionField.textContent = weatherObj.weatherDescription;
    if (weatherUnit.name === "fahrenheit") {
      tempField.textContent = celsiusToFahrenheit(weatherObj.temp);
      feelsLikeField.textContent = celsiusToFahrenheit(weatherObj.feels_like);
    } else {
      tempField.textContent = weatherObj.temp;
      feelsLikeField.textContent = weatherObj.feels_like;
    }
    tempUnits.forEach((item) => {
      item.textContent = weatherUnit.symbol;
    });
    weatherIcon.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${weatherObj.iconId}@2x.png`
    );
  };

  const celsiusToFahrenheit = (celsius) => {
    return Math.round((Number(celsius) * (9 / 5) + 32) * 100) / 100;
  };

  const fahrenheitToCelsius = (fahrenheit) => {
    return Math.round((Number(fahrenheit) - 32) * (5 / 9) * 100) / 100;
  };

  const changeToFahrenheit = () => {
    if (weatherUnit.name === "fahrenheit") return;
    weatherUnit = {
      name: "fahrenheit",
      symbol: "°F",
    };
    tempField.textContent = celsiusToFahrenheit(tempField.textContent);
    feelsLikeField.textContent = celsiusToFahrenheit(
      feelsLikeField.textContent
    );
    tempUnits.forEach((item) => {
      item.textContent = weatherUnit.symbol;
    });
  };

  const changeToCelsius = () => {
    if (weatherUnit.name === "celsius") return;
    weatherUnit = {
      name: "celsius",
      symbol: "°C",
    };
    tempField.textContent = fahrenheitToCelsius(tempField.textContent);
    feelsLikeField.textContent = fahrenheitToCelsius(
      feelsLikeField.textContent
    );
    tempUnits.forEach((item) => {
      item.textContent = weatherUnit.symbol;
    });
  };

  searchBtn.addEventListener("click", (e) => {
    if (cityInput.value === "") {
      alert("Please Enter city");
      return;
    }

    fetchCityCoordinates(cityInput.value)
      .then((cityCoord) => fetchWeatherData(cityCoord))
      .then((weatherData) => {
        displayWeather(getWeatherObject(weatherData));
      });
  });

  toggleTempUnit.addEventListener("change", (e) => {
    if (toggleTempUnit.checked) {
      changeToFahrenheit();
    } else {
      changeToCelsius();
    }
  });

  return {
    displayWeather,
    changeToFahrenheit,
    changeToCelsius,
  };
})();

fetchCityCoordinates("London", 1)
  .then((cityCoord) => {
    return fetchWeatherData(cityCoord);
  })
  .then((weatherData) => {
    console.log(weatherData);
    const weatherObj = getWeatherObject(weatherData);
    WeatherDisplayController.displayWeather(weatherObj);
  });
