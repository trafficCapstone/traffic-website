const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  id: Number,
  location: [Number, Number],
  name: String,
  volume: Number,
  startTime: Number,
  endTime: Number,
});

module.exports = conn => {
  global.TrafficModel = conn.model('Traffic', trafficSchema, 'data');
};
