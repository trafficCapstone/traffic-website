const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  camera: Number,
});

module.exports = mongoose.model('Record', recordSchema, 'records');
