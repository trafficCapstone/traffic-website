const map = L.map('heatmap-container').setView([45.52, -122.67], 12);
L.tileLayer(
  'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw',
  {
    maxZoom: 18,
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
  },
).addTo(map);

const heat = L.heatLayer([], { radius: 25 });
heat.addTo(map);

const setHeatmap = startTime => {
  heat.setLatLngs(
    trafficData.reduce((acc, item) => {
      const midTime = Math.round((item.startTime + item.endTime) / 2);
      if (midTime > startTime) {
        acc.push([item.location[0], item.location[1], item.volume / 2500]);
      }
      return acc;
    }, []),
  );
};
