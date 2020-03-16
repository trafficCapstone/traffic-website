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

module.exports = conn => {
  global.ObjectModel = conn.model('Object', objectSchema, 'objects');
};
