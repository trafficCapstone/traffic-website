import moment from 'moment';
import React, { useEffect, useState } from 'react';

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

export default () => {
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    console.log('fetchData()');
    const [trafficData, objectData] = await Promise.all([
      fetch('/api/traffic').then((res) => res.json()),
      fetch('/api/objects').then((res) => res.json()),
    ]);

    setLoading(false);

    initData(trafficData, objectData);
  };

  const initData = (trafficData, objectData) => {
    console.log('initData()');
    const { d3, L } = window;

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

    (() => {
      const height = 400;
      const width = 800;

      const pie = d3
        .pie()
        .padAngle(0.005)
        .sort(null)
        .value((d) => d.value);

      const data = objectData.reduce((acc, { className }) => {
        const slice = acc.find(({ name }) => name === className);
        if (slice) {
          slice.value++;
        } else {
          acc.push({ name: className, value: 1 });
        }
        return acc;
      }, []);

      const arcs = pie(data);

      const arc = () => {
        const radius = Math.min(width, height) / 2;
        return d3
          .arc()
          .innerRadius(radius * 0.6)
          .outerRadius(radius - 1);
      };

      const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.name))
        .range(
          d3
            .quantize((t) => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse(),
        );

      const svg = d3
        .create('svg')
        .attr('viewBox', [-width / 2, -height / 2, width, height]);

      svg
        .selectAll('path')
        .data(arcs)
        .join('path')
        .attr('fill', (d) => color(d.data.name))
        .attr('d', arc())
        .append('title')
        .text((d) => `${d.data.name}: ${d.data.value.toLocaleString()}`);

      svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .selectAll('text')
        .data(arcs)
        .join('text')
        .attr('transform', (d) => `translate(${arc().centroid(d)})`)
        .call((text) =>
          text
            .append('tspan')
            .attr('y', '-0.4em')
            .attr('font-weight', 'bold')
            .text((d) => d.data.name),
        )
        .call((text) =>
          text
            .filter((d) => d.endAngle - d.startAngle > 0.25)
            .append('tspan')
            .attr('x', 0)
            .attr('y', '0.7em')
            .attr('fill-opacity', 0.7)
            .text((d) => d.data.value.toLocaleString()),
        );

      const node = svg.node();

      const container = document.getElementById('donut-chart-container');
      container.appendChild(node);
    })();

    const rangeText = document.getElementById('range-text');
    const slider = document.getElementById('range-slider');

    const getSliderValues = (value) => {
      const currentTime = moment().unix();
      const [text, time] = ranges[value / 10];
      return [text, currentTime - time];
    };

    const updateData = (value) => {
      const [text, startTime] = getSliderValues(value);
      slider.value = value;
      rangeText.innerHTML = text;
      setHeatmap(startTime);
      // updateHistogram(startTime);
    };

    slider.addEventListener('change', (e) => {
      const value = 10 * Math.round(e.target.valueAsNumber / 10);
      updateData(value);
    });

    updateData(0);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

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

      {/* <script src="/js/heatmap.js"></script>
      <script src="/js/data.js"></script>
      <script src="/js/histogram.js"></script>
      <script src="/js/donutChart.js"></script>
      <script src="/js/slider.js"></script> */}
    </>
  );
};
