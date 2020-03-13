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
  const { id, className, timestamp, camera, properties } = req.body;

  // Send 400 if any data values are omitted in body
  if (!id || !className || !timestamp || !camera || !properties) {
    return res.sendStatus(400);
  }

  await new ObjectModel({
    id,
    className,
    timestamp,
    camera,
    properties,
  }).save();

  res.json(req.body);
});

api.post('/cameras', async (req, res) => {
  const { id, name, location } = req.body;

  console.log(req.body);

  // Send 400 if any data values are omitted in body
  if (!id || !name || !location) {
    return res.sendStatus(400);
  }

  await new CameraModel({ id, name, location }).save();

  res.json(req.body);
});

module.exports = api;
