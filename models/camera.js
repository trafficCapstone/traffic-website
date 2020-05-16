const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: [Number],
  path: String,
});

module.exports = mongoose.model('Camera', cameraSchema, 'cameras');
