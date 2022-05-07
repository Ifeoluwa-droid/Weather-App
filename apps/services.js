function locationUrl (apiKey, location, limit) {
  return `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=${limit}&appid=${apiKey}`;
}


function getWeatherUrl (latitude, longitude, apiKey) {
  queryParams = {
    'lat': latitude,
    'lon': longitude,
    'appid': apiKey,
    'units': 'metric',
    'exclude': 'minutely'
  };
  queryString = 'lat=' + queryParams['lat'] + '&lon=' + queryParams['lon'] + '&appid=' + queryParams['appid'] + '&units=' + queryParams['units'] + "&exclude=" + queryParams['exclude'];
  const weatherUrl = "https://api.openweathermap.org/data/2.5/onecall" + "?" + queryString;
  return weatherUrl;
}

// Frontend
function changeActive(index, links) {
  for (var i = 0; i <= 7; i++) {
    if (i === index) {
      links[i] = "time-active";
    } else {
      links[i] = "";
    }
  }
}

module.exports = {
  locationUrl: locationUrl,
  getWeatherUrl: getWeatherUrl,
  changeActive: changeActive
}
