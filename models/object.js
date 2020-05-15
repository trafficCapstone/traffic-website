const mongoose = require('mongoose');

const objectSchema = new mongoose.Schema({
  id: Number,
  className: String,
  timestamp: Number,
  camera: Number,
  properties: {
    c: Number,
    x: Number,
    y: Number,
    w: Number,
    h: Number,
  },
});

module.exports = mongoose.model('Object', objectSchema, 'objects');
