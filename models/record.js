const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  camera: Number,
});

const RecordModel = mongoose.model('Record', recordSchema, 'records');

module.exports = RecordModel;
