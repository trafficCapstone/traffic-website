const ranges = [
  ['Past 5 Years', 157788000],
  ['Past Year', 31536000],
  ['Past 6 Months', 15768000],
  ['Past 3 Months', 7884000],
  ['Past Month', 2628000],
  ['Past Two Weeks', 1209600],
  ['Past Week', 604800],
  ['Past 3 Days', 259200],
  ['Past Day', 86400],
  ['Past 3 Hours', 10800],
  ['Past Hour', 3600],
];

const rangeText = document.getElementById('range-text');
const slider = document.getElementById('range-slider');
const initialValue = 100;

const getSliderValues = value => {
  const currentTime = moment().unix();
  const [text, time] = ranges[value / 10];
  return [text, currentTime - time];
};

const updateData = value => {
  const [text, startTime] = getSliderValues(value);
  slider.value = value;
  rangeText.innerHTML = text;
  setHeatmap(startTime);
  updateHistogram(startTime);
  // updateDonutChart(startTime);
};

slider.addEventListener('change', e => {
  const value = 10 * Math.round(e.target.valueAsNumber / 10);
  updateData(value);
});

updateData(0);
