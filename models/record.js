const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  camera: Number,
});

module.exports = conn => {
  global.RecordModel = conn.model('Record', recordSchema, 'records');
};
