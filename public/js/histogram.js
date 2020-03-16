const height = 400;
const width = 800;
const margin = { top: 20, right: 20, bottom: 30, left: 40 };

const x = d3
  .scaleLinear()
  .domain([0, 24])
  .range([margin.left, width - margin.right]);

const bins = d3
  .histogram()
  .domain(x.domain())
  .thresholds(x.ticks(24))([0]);

const y = d3
  .scaleLinear()
  .domain([0, d3.max(bins, d => d.length)])
  .range([height - margin.bottom, margin.top]);

const xAxis = g =>
  g.attr('transform', `translate(0,${height - margin.bottom})`).call(
    d3
      .axisBottom(x)
      .ticks(24)
      .tickSizeOuter(0),
  );

const yAxis = g =>
  g
    .attr('transform', `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(10))
    .call(g => g.select('.domain').remove());

const svg = d3.create('svg').attr('viewBox', [0, 0, width, height]);

// Draw histogram
svg
  .append('g')
  .attr('fill', 'steelblue')
  .selectAll('rect')
  .data(bins)
  .join('rect')
  .attr('x', d => x(d.x0) + 1)
  .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
  .attr('y', d => y(d.length))
  .attr('height', d => y(0) - y(d.length));

// Draw x-axis
svg
  .append('g')
  .attr('class', 'x-axis')
  .call(xAxis);

// Draw y-axis
svg
  .append('g')
  .attr('class', 'y-axis')
  .call(yAxis);

const node = svg.node();

const container = document.getElementById('histogram-container');
container.appendChild(node);

// Function to update the data inside the histogram
const updateHistogram = startTime => {
  const filteredData = trafficData.reduce((acc, item) => {
    const midTime = Math.round((item.startTime + item.endTime) / 2);
    if (midTime > startTime) {
      acc.push(moment(midTime).hour());
    }
    return acc;
  }, []);

  const newBins = d3
    .histogram()
    .domain(x.domain())
    .thresholds(x.ticks(24))(filteredData);

  y.domain([0, d3.max(newBins, d => d.length)]);

  svg.select('.y-axis').call(yAxis);

  svg
    .selectAll('rect')
    .remove()
    .exit()
    .data(newBins)
    .join('rect')
    .attr('fill', 'steelblue')
    .attr('x', d => x(d.x0) + 1)
    .attr('width', d => Math.max(0, x(d.x1) - x(d.x0) - 1))
    .attr('y', d => y(d.length))
    .attr('height', d => y(0) - y(d.length));
};
