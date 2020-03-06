const mongoose = require('mongoose');

const cameraSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: [Number],
});

module.exports = conn => {
  global.CameraModel = conn.model('Camera', cameraSchema, 'cameras');
};
