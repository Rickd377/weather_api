const apiKey = '4f91d01bf628ee6b33156de0a0248545';

async function getWeather() {
  const city = document.getElementById('searchbar').value;
  const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    if (weatherData.cod === 200) {
      document.getElementById('cityname').innerText = weatherData.name;
      document.getElementById('temperature').innerText = weatherData.main.temp;
      document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
      document.getElementById('feels-like').innerText = `${weatherData.main.feels_like}C°`;
      document.getElementById('wind-speed').innerText = `${weatherData.wind.speed} km/u`;
      document.getElementById('weather-icon').innerHTML = `<img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" width="100" height="100" alt="Weather icon">`;

      // Convert sunrise and sunset from UNIX timestamp to readable time
      const sunrise = new Date(weatherData.sys.sunrise * 1000);
      const sunset = new Date(weatherData.sys.sunset * 1000);
      document.getElementById('sunrise').innerText = sunrise.toLocaleTimeString();
      document.getElementById('sunset').innerText = sunset.toLocaleTimeString();
    } else {
      alert('City not found');
    }

    const forecastResponse = await fetch(forecastUrl);
    const forecastData = await forecastResponse.json();

    if (forecastData.cod === "200") {
      const rainChance = forecastData.list[0].pop * 100; // Probability of precipitation for the next interval
      document.getElementById('rain-chance').innerText = `${rainChance}%`;

      const forecastElements = ['day1', 'day2', 'day3', 'day4', 'day5'];
      for (let i = 0; i < 5; i++) {
        const forecast = forecastData.list[i * 8]; // 8 intervals per day
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'long' });
        const temp = forecast.main.temp;
        const icon = forecast.weather[0].icon;

        document.getElementById(forecastElements[i]).innerHTML = `
          <div>${day}</div>
          <div><img src="http://openweathermap.org/img/wn/${icon}.png" alt="Weather icon"></div>
          <div>${temp}C°</div>
        `;
      }
    } else {
      alert('Error fetching forecast data');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    alert('Error fetching weather data');
  }
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
}