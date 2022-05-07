let timeTabs = $(".time");
let nextSevenDaysBtns = $(".next-7-days");
let backBtn = $(".back-btn");
let changeLocationBtn = $(".filter-icon");
let changeLocationModal = $(".change-location");
let changeLocationInput = $(".change-location input");

const modalPopUp = {
  opacity: 1.0,
}

const modalDisappear = {
  opacity: 0.0,
}

const timing = 500;
const easing = "linear";

Array.from(timeTabs).forEach((item, i) => {
  $(item).on("click", () => {
    let currentActiveBtn = $(".time-active");
    currentActiveBtn.removeClass("time-active");
    $(item).addClass("time-active");

    if ($(item).hasClass("get-next-7-days")) {
      nextSevenDaysBtns.removeClass("display-none");
      backBtn.addClass("rotate-back");
    }
  });
});

backBtn.on("click", () => {
  backBtn.removeClass("rotate-back");
  Array.from(timeTabs).forEach((item, i) => {
    if (!($(item).hasClass("get-next-7-days"))) {
      $(item).addClass("time-active");
    } else {
      $(item).removeClass("time-active");
    }
  });
  nextSevenDaysBtns.addClass("display-none");
});

changeLocationBtn.on("click", () => {
  if (changeLocationModal.css("opacity") === '0') {
    changeLocationModal.removeClass("display-none");
    changeLocationModal.animate(modalPopUp, timing, easing);
  } else {
    changeLocationModal.animate(modalDisappear, timing, easing);
    setTimeout(() => {
      changeLocationModal.addClass("display-none");
    }, timing);
  }
});

changeLocationInput.focus(() => {
  changeLocationInput.addClass("focus-placeholder-color");
});


let rainIndices = [];
let times = [];

const options = {
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      ticks: {
        display: false
      },
      beginAtzero: true,
      grid: {
        display: false,
        drawBorder: false
      }
    },
    x: {
      beginAtzero: true,
      grid: {
        display: false
      }
    }
  }
};

const data = {
  labels: times,
  datasets: [{
    label: '',
    data: rainIndices,
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0
  }]
};

async function plotRainData() {
  fetch('rain_indices.txt').then((response) => {
    return response.text().then((text) => {
      dataPoints = text.split('\n');
      dataPoints.pop();
      dataPoints.forEach((item, i) => {
        rainIndices.push(Number(item));
        times.push('')
      });
    }).then(() => {
      let myChart = document.getElementById('myChart').getContext('2d');

      let massPopChart = new Chart(myChart, {
        type: 'line',
        data: data,
        options: options
      });
    });
  });
}

plotRainData();
