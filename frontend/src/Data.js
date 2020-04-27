import React from 'react';

export default () => (
  <>
    <h3 class="header">
      <strong>Data Visualization</strong>
    </h3>

    <div class="container" style={{ textAlign: 'center' }}>
      <p id="range-text"></p>
      <input type="range" style={{ width: '400px' }} id="range-slider"></input>

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
        <h4 class="col-12 text-center mt-4">Object Density vs. Time of Day</h4>

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

    <script src="/libraries/moment.min.js"></script>
    <script src="/js/heatmap.js"></script>
    <script src="/js/data.js"></script>
    <script src="/js/histogram.js"></script>
    <script src="/js/donutChart.js"></script>
    <script src="/js/slider.js"></script>
  </>
);
