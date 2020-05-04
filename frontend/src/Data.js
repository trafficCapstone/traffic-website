import React, { useEffect } from 'react';

export default () => {
  const initData = async () => {
    const { L } = window;
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

    const res = await fetch('/api/traffic');
    const trafficData = await res.json();

    const setHeatmap = (startTime) => {
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
  };

  useEffect(() => {
    initData();
  }, []);

  return (
    <>
      <h3 class="header">
        <strong>Data Visualization</strong>
      </h3>

      <div class="container" style={{ textAlign: 'center' }}>
        <p id="range-text"></p>
        <input
          type="range"
          style={{ width: '400px' }}
          id="range-slider"
        ></input>

        <div class="col-12 row chart">
          <h4 class="col-12 text-center mt-4">Traffic Speed Counts Heatmap</h4>

          <div class="col-12">
            <div id="heatmap-container"></div>
          </div>
        </div>

        <p>
          Data from{' '}
          <a href="http://gis-pdx.opendata.arcgis.com/datasets/traffic-speed-counts">
            City of Portland, Oregon Open Data
          </a>
        </p>

        <div class="col-12 row chart">
          <h4 class="col-12 text-center mt-4">
            Object Density vs. Time of Day
          </h4>

          <div id="histogram-container" class="col-12"></div>
        </div>

        <div class="col-12 row chart">
          <h4 class="col-12 text-center mt-4">Object Classes</h4>

          <div id="donut-chart-container" class="col-12"></div>
        </div>
      </div>

      <script type="text/javascript">
        const trafficData = []; const objectData = [];
      </script>

      <script src="/js/heatmap.js"></script>
      <script src="/js/data.js"></script>
      <script src="/js/histogram.js"></script>
      <script src="/js/donutChart.js"></script>
      <script src="/js/slider.js"></script>
    </>
  );
};
