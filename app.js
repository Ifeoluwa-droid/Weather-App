// Imports
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require('request');
const fs = require('fs');
const dateTime = require(__dirname + '/apps/date-time');
const services = require(__dirname + '/apps/services');
const private = require(__dirname + '/apps/private');


const app = express();

// Requirements
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const containers = ["container-1", "container-2"];

// Globals
let url = "";
let renderNext24Hours = true;
let dayData = {};
let nextSevenDaysWeatherData = [];
let nextSevenDaysData = [];
let location = "";
let weatherData = "";
let currentUnixTime = "";
let next24HoursWeatherData = [];
let next24HoursRainIndices = '';
let next24HoursData = [];
let nextSevenDays = [];
let locationData = [];
let activeLinks = ["", "", "", "", "", "", "", ""];
let rotateBackBtn = "";
let displayDays = "";


async function getLocationWeatherData(response, locationUrl, apiKey, renderNext24Hours) {
  await request(locationUrl, {
    json: true
  }, async (err, weatherResponse, body) => {
    if (err) {
      response.render('oops-1.ejs');
    }

    try {
      const weatherUrl = services.getWeatherUrl(body[0].lat, body[0].lon, apiKey);
      console.log(weatherUrl);
      await request(weatherUrl, {
        json: true
      }, async (err, weatherResponse, body) => {
        if (err) {
          response.render('oops-1.ejs');
        }

        try {
          weatherData = body;
          currentUnixTime = weatherData['current']['dt'];
          next24HoursWeatherData = weatherData.hourly.slice(1, 25);
          nextSevenDaysWeatherData = weatherData.daily.slice(1, 8);

          nextSevenDays = [];
          nextSevenDaysWeatherData.forEach((item, i) => {
            nextSevenDays.push(dateTime.getDayOfWeek(item.dt))
          });

          nextSevenDaysData = [];
          nextSevenDaysWeatherData.forEach((item, i) => {
            nextSevenDaysData.push({
              day: dateTime.getDayOfWeek(item.dt),
              dayTemp: item.temp.day,
              nightTemp: item.temp.night,
              humidity: item.humidity,
              description: item.weather[0].description,
              icon: item.weather[0].icon,
            });
          });

          next24HoursData = [];
          next24HoursRainIndices = '';
          next24HoursWeatherData.forEach((item, i) => {
            next24HoursData.push({
              time: dateTime.getTime(item.dt),
              temp: item.temp,
              icon: item.weather[0].icon
            });

            next24HoursRainIndices += (900 - item.weather[0].id).toString() + '\n';
          });

          console.log(next24HoursData);
          fs.unlink('public/rain_indices.txt', (err) => {
            console.log("file deleted...");
          });

          fs.writeFile('public/rain_indices.txt', next24HoursRainIndices, (err) => {
            if (err) throw err;
            console.log("file saved!");
          });

          response.render('view-2', {
            container: containers[1],
            location: location,
            currentTime: dateTime.getTime(currentUnixTime),
            currentDay: dateTime.getDayAndMonth(currentUnixTime),
            currentTemp: weatherData.current.temp,
            description: weatherData.current.weather[0].description,
            weatherIcon: weatherData.current.weather[0].icon,
            next24HoursData: next24HoursData,
            nextSevenDays: nextSevenDays,
            renderNext24Hours: renderNext24Hours,
            dayData: dayData,
            activeLinks: activeLinks,
            displayDays: displayDays,
            rotateBackBtn: rotateBackBtn,
          });
        } catch (e) {
          if (e instanceof TypeError) {
            response.render('oops-2.ejs');
          }
        }
      });
    } catch (e) {
      if (e instanceof TypeError) {
        response.render('oops-2.ejs');
      }
    }
  });
}

function changeLocationAndUserView(enteredLocation) {
  location = enteredLocation;
  url = services.locationUrl(private.apiKey, location, 1);
  activeLinks[0] = "time-active";
  displayDays = "display-none";
}

// Post and Get Requets
app.post('/get-weather', (req, res) => {
  changeLocationAndUserView(req.body.location);
  getLocationWeatherData(res, url, private.apiKey, renderNext24Hours);
});

app.post('/change-location', (req, res) => {
  changeLocationAndUserView(req.body.newLocation);
  console.log(url);
  getLocationWeatherData(res, url, private.apiKey, renderNext24Hours);
});

// Get and Post Requests
app.get('/', (req, res) => {
  res.render('view-1', {
    container: containers[0]
  });
});

app.get('/input-details', (req, res) => {
  // Get the user to sign up and enter a location
  res.render('input-details', {
    container: containers[0]
  });
});

app.get('/get-weather', (req, res) => {
  getLocationWeatherData(res, url, private.apiKey, renderNext24Hours);
});

app.get('/try-location-again', (req, res) => {
  res.redirect('/input-details');
});

app.get('/try-internet-again', (req, res) => {
  res.redirect('/input-details');
});

app.get('/:nextDayNumber', (req, res) => {
  switch (req.params.nextDayNumber) {
    case 'next-7-days-1':
    case 'next-7-days-2':
    case 'next-7-days-3':
    case 'next-7-days-4':
    case 'next-7-days-5':
    case 'next-7-days-6':
    case 'next-7-days-7':
      renderNext24Hours = false;
      displayDays = "";
      rotateBackBtn = "rotate-back";
      break;
    case 'next-24-hours':
      renderNext24Hours = true;
      displayDays = "display-none";
      rotateBackBtn = "";
      break;
  }
  switch (req.params.nextDayNumber) {
    case 'next-7-days-1':
      dayData = nextSevenDaysData[0];
      services.changeActive(1, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-2':
      dayData = nextSevenDaysData[1];
      services.changeActive(2, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-3':
      dayData = nextSevenDaysData[2];
      services.changeActive(3, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-4':
      dayData = nextSevenDaysData[3];
      services.changeActive(4, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-5':
      dayData = nextSevenDaysData[4];
      services.changeActive(5, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-6':
      dayData = nextSevenDaysData[5];
      services.changeActive(6, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-7-days-7':
      dayData = nextSevenDaysData[6];
      services.changeActive(7, activeLinks);
      res.redirect('/get-weather');
      break;
    case 'next-24-hours':
      services.changeActive(0, activeLinks);
      res.redirect('/get-weather');
  };
})

// Start server
app.listen(process.env.PORT || 3000, () => {
  console.log("server is running");
});
