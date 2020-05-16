const express = require('express');

const api = express.Router();

api.get('/', (req, res) => {
  res.send('API home page');
});

api.get('/cameras', async (req, res) => {
  const cameras = await global.CameraModel.find();

  const query = req.query.q;
  if (query) {
    return res.json(
      cameras.filter((camera) =>
        camera.name.toLowerCase().includes(query.toLowerCase()),
      ),
    );
  }

  res.json(cameras);
});

api.get('/objects', async (req, res) => {
  let objects = await global.ObjectModel.find();

  // const start = req.query.start;
  // if (start) {
  //   objects = objects.filter(object => object.timestamp >= Number(start));
  // }
  //
  // const end = req.query.end;
  // if (end) {
  //   objects = objects.filter(object => object.timestamp <= Number(end));
  // }

  res.json(objects);
});

api.get('/objects/:id', async (req, res) => {
  const objects = await global.ObjectModel.find({ id: req.params.id });
  res.json(objects);
});

api.post('/objects', async (req, res) => {
  const { id, className, timestamp, camera, properties } = req.body;

  // Send 400 if any data values are omitted in body
  if (!id || !className || !timestamp || !camera || !properties) {
    return res.sendStatus(400);
  }

  await new global.ObjectModel({
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

  // Send 400 if any data values are omitted in body
  if (!id || !name || !location) {
    return res.sendStatus(400);
  }

  await new global.CameraModel({ id, name, location }).save();

  res.json(req.body);
});

api.get('/traffic', async (req, res) => {
  const objects = await global.TrafficModel.find();
  res.json(objects);
});

api.post('/traffic', async (req, res) => {
  const { id, name, location, volume, startTime, endTime } = req.body;

  // Send 400 if any data values are omitted in body
  if (!id || !name || !location || !volume || !startTime || !endTime) {
    return res.sendStatus(400);
  }

  await new global.TrafficModel({
    id,
    name,
    location,
    volume,
    startTime,
    endTime,
  }).save();

  res.json(req.body);
});

module.exports = api;
