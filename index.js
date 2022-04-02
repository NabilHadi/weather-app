console.log("Hello Weather");
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

fetchCityCoordinates("jeddah", 1)
  .then((cityCoord) => {
    return fetchWeatherData(cityCoord);
  })
  .then((weatherData) => {
    console.log(weatherData);
  });
