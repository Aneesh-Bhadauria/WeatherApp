'use strict';

const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherEl = document.getElementById('current-weather-infos');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const API_KEY = 'f34dedcef4fc0a94e0fbf9961fefaaaa';

setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const hoursIn12Hr = hour >= 13 ? hour % 12 : hour;
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? 'PM' : 'AM';
  timeEl.innerHTML =
    (hoursIn12Hr < 10 ? '0' + hoursIn12Hr : hoursIn12Hr) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ' ' +
    `<span id="am-pm">${ampm}</span>`;
  dateEl.innerHTML = days[day] + ',' + date + ' ' + months[month];
}, 1000);

function getWeatherData() {
  navigator.geolocation.getCurrentPosition(success => {
    console.log(success);

    let { latitude, longitude } = success.coords;
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&units=metric&appid=${API_KEY}`
    )
      .then(res => res.json())
      .then(data => {
        console.log(data);
        showWeatherData(data);
      });
  });
}
getWeatherData();

function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset } = data.current;
  timezone.innerHTML = data.timezone;
  countryEl.innerHTML = data.lat + 'N' + data.lon + 'E';
  currentWeatherEl.innerHTML = `<div class="weather-infos">
  <div>Humidity</div>
  <div>${humidity}</div>
  </div>
  
  <div class="weather-infos">
  <div>Pressure</div>
  <div>${pressure}</div>
  </div>
  <div class="weather-infos">
  <div>Sunrise</div>
  <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
  </div>
  <div class="weather-infos">
  <div>Sunset</div>
  <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
  </div>`;

  let otherDayForecast = '';

  data.daily.forEach((d, i) => {
    if (i === 0) {
      currentTempEl.innerHTML = `<img
        src="http://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png"
        alt="weather icon"
        class="w-icon"
      />
      <div class="other">
        <div class="day">${window.moment(d.dt * 1000).format('ddd')}</div>
        <div class="temp">Night - ${d.temp.night}&#176; C</div>
        <div class="temp">Day - ${d.temp.day}&#176; C</div>
      </div>`;
    } else {
      otherDayForecast += ` <div class="weather-forecast-item">
          <div class="day">${window.moment(d.dt * 1000).format('ddd')}</div>
          <img
            src="http://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png"
            alt="weather icon"
            class="w-icon"
          />
          <div class="temp">Night - ${d.temp.night} &#176; C</div>
          <div class="temp">Day - ${d.temp.day} &#176; C</div>
        </div>`;
    }
  });
  weatherForecastEl.innerHTML = otherDayForecast;
}
