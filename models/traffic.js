const mongoose = require('mongoose');

const trafficSchema = new mongoose.Schema({
  id: Number,
  location: [Number, Number],
  name: String,
  volume: Number,
  startTime: Number,
  endTime: Number,
});

const TrafficModel = mongoose.model('Traffic', trafficSchema, 'traffic');

module.exports = TrafficModel;
