const API_KEY = "36ce6e444ccdccbe388d184c5b4b92e8";

const tempConverter = {
  kToC(kTemp) {
    return Math.round(Number(kTemp) - 273.15);
  },
  kToF(kTmep) {
    return Math.round((Number(kTmep) - 273.15) * (9 / 5) + 32);
  },
};

const weatherDOM = (() => {
  const container = document.querySelector(".weather");
  const location = container.querySelector(".location");
  const countryCode = container.querySelector(".country-code");
  const icon = container.querySelector(".icon");
  const description = container.querySelector(".description");
  const temp = container.querySelector(".temp");
  const feelsLike = container.querySelector(".feels_like");
  const humidity = container.querySelector(".humidity");

  const loading = document.querySelector(".loading");
  const weather = document.querySelector(".weather");

  return {
    displayWeather(data) {
      location.textContent = data.locationName;
      countryCode.textContent = data.countryCode;
      icon.style[
        "background-image"
      ] = `url(https://openweathermap.org/img/w/${data.icon}.png)`;
      description.textContent = data.description;
      temp.innerHTML = `${data.tempInC} &deg;C / ${data.tempInF} &deg;F`;
      feelsLike.innerHTML = `Feels like ${data.feelsLikeInC} &deg;C / ${data.feelsLikeInF} &deg;F`;
      humidity.textContent = `Humidity: ${data.humidity}%`;
    },
    showLoading() {
      loading.classList.add("show");
      weather.style.display = "none";
    },

    hideLoading() {
      loading.classList.remove("show");
      weather.style.display = "block";
    },
  };
})();

async function getWeatherDataByCoords({ lat, lon }) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

  return await fetch(url, { mode: "cors" });
}

async function getWeatherDataByQuery(query) {
  const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${API_KEY}`;

  const geoRespone = await (await fetch(geoUrl, { mode: "cors" })).json();

  return getWeatherDataByCoords({
    lat: geoRespone[0].lat,
    lon: geoRespone[0].lon,
  });
}

async function processApiRespone(respone) {
  const data = await respone.json();
  console.log(data);

  return {
    locationName: data.name,
    tempInC: tempConverter.kToC(data.main.temp),
    tempInF: tempConverter.kToF(data.main.temp),
    feelsLikeInC: tempConverter.kToC(data.main.feels_like),
    feelsLikeInF: tempConverter.kToF(data.main.feels_like),
    humidity: data.main.humidity,
    icon: data.weather[0].icon,
    description: data.weather[0].description,
    title: data.weather[0].main,
    countryCode: data.sys.country,
  };
}

async function changeWeather(locationData = { coords: null, query: "" }) {
  weatherDOM.showLoading();
  try {
    let weatherRespone;
    if (locationData.coords) {
      weatherRespone = await getWeatherDataByCoords(locationData.coords);
    } else {
      weatherRespone = await getWeatherDataByQuery(locationData.query);
    }

    const weatherData = await processApiRespone(weatherRespone);

    weatherDOM.displayWeather(weatherData);
  } catch (error) {
    console.log(error);
  } finally {
    // Unneccessary timeout; but used as a dely to show loading screen
    setTimeout(() => {
      weatherDOM.hideLoading();
    }, 500);
  }
}

const form = document.querySelector("form");
const input = document.querySelector("#location-input");
const submitBtn = document.querySelector("#location-form-submit-btn");
const getMyLocationBtn = document.querySelector("#getLocationBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  changeWeather({ query: input.value });
});

getMyLocationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    function onSuccess(position) {
      changeWeather({
        coords: {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        },
      });
    },
    function onError(error) {
      console.log(error);
    }
  );
});

window.addEventListener("DOMContentLoaded", () => {
  changeWeather({ query: "Cairo" });
});
