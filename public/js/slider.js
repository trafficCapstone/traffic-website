(() => {
  const rangeText = document.getElementById('range-text');
  const slider = document.getElementById('range-slider');
  const initialValue = 100;

  slider.value = rangeText.innerHTML = initialValue;

  slider.addEventListener('change', e => {
    const value = Math.round(e.target.valueAsNumber);
    slider.value = rangeText.innerHTML = value;
  });
})();
