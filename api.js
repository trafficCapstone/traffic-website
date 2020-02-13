const express = require('express');
const api = express.Router();

api.get('/', (req, res) => {
  res.send('API home page');
});

api.get('/cameras', async (req, res) => {
  const cameras = await CameraModel.find();
  res.json(cameras);
});

api.get('/objects', async (req, res) => {
  const objects = await ObjectModel.find();
  res.json(objects);
});

api.post('/objects', async (req, res) => {
  const { className, timestamp, camera } = req.body;

  // Send 400 if any data values are omitted in body
  if (!className || !timestamp || !camera) {
    res.sendStatus(400);
  }

  await new ObjectModel({ className, timestamp, camera }).save();

  res.json(req.body);
});

module.exports = api;
