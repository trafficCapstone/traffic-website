const axios = require('axios');
const mongoose = require('mongoose');

const cameras = require('./cameras.json');
const objects = require('./objects.json');
const traffic = require('./traffic.json');

const URI = 'http://localhost:8000/api';

(async () => {
  console.log('Adding cameras to database...');
  // await Promise.all(
  //   cameras.map((camera) => axios.post(`${URI}/cameras`, camera)),
  // );
  console.log('  Done!');

  console.log('Adding objects to database...');
  // await Promise.all(
  //   objects.map((object) => axios.post(`${URI}/objects`, object)),
  // );
  console.log('  Done!');

  console.log('Adding demo data to database...');
  await Promise.all(traffic.map((t) => axios.post(`${URI}/traffic`, t)));
  console.log('  Done!');
})();
