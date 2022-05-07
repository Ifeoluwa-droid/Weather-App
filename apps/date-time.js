
function getTime(unixTime) {
  currentTime = new Date(unixTime * 1000);
  currentHour = Math.ceil(currentTime.getHours() / 12) > 1 ? currentTime.getHours() % 12 : currentTime.getHours() === 0 ? 12 : currentTime.getHours();
  currentMinute = currentTime.getMinutes() < 10 ? `0${currentTime.getMinutes()}` : currentTime.getMinutes();
  meridian = Math.ceil(currentTime.getHours() / 12) > 1 ? 'PM' : 'AM';
  return `${currentHour} : ${currentMinute} ${meridian}`;
}

function getDayOfWeek(unixTime) {
  currentTime = new Date(unixTime * 1000);
  const options = {
    weekday: 'long',
  };
  day = currentTime.toLocaleDateString('en-US', options);
  return `${day}`;
}

function getDayAndMonth(unixTime) {
  currentTime = new Date(unixTime * 1000);
  const options = {
    weekday: 'short',
    month: 'long',
    day: 'numeric'
  };
  day = currentTime.toLocaleDateString('en-US', options);
  return `${day}`;
}

module.exports = {
  getTime: getTime,
  getDayOfWeek: getDayOfWeek,
  getDayAndMonth: getDayAndMonth
}
