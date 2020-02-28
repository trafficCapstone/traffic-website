////////////////////////////////////////////////////////
// Set up:
////////////////////////////////////////////////////////

// set port number and hostname
const port = 8081,
  hostname = 'http://localhost';

// global imported libraries
global.fs = require('fs');
global.unzip = require('unzip-stream');
global.glob = require('glob');
global.probe = require('probe-image-size');
global.csv = require('csvtojson');
global.rimraf = require('./public/libraries/rimraf');
global.util = require('util');
global.archiver = require('archiver');

global.readdirAsync = util.promisify(fs.readdir);

// local imported libraries
const express = require('express'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  http_module = require('http'),
  path = require('path'),
  sys = require('util'),
  cookieParser = require('cookie-parser'),
  // sqlite3 = require('sqlite3').verbose(),
  upload = require('express-fileupload'),
  mongoose = require('mongoose'),
  cors = require('cors'),
  api = require('./routes/api'),
  app = express(),
  http = http_module.Server(app);

global.app_path = path.join(__dirname, 'public');
if (global.app_path.includes(':')) {
  global.app_path = path.join(__dirname, 'public').split(':')[1];
}

console.log(global.app_path);

// get path
global.currentPath = process.cwd();
global.dataFolder = currentPath + '/data/';

// read files
//global.colorsJSON = JSON.parse(fs.readFileSync(dataFolder + 'colors.json', 'utf8'));

const { mongo: mongoCredentials } = require('./credentials');
const opts = {
  server: {
    socketOptions: { keepAlive: 1 },
  },
};
const cameraSchema = new mongoose.Schema({
  id: Number,
  name: String,
  location: [Number],
});
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
const recordSchema = new mongoose.Schema({
  startTime: Number,
  endTime: Number,
  camera: Number,
});

mongoose.connect(mongoCredentials.development.connectionString, opts, err => {
  if (err) console.error(err.message);
});
global.CameraModel = mongoose.model('Camera', cameraSchema, 'cameras');
global.ObjectModel = mongoose.model('Object', objectSchema, 'objects');
global.RecordModel = mongoose.model('Record', recordSchema, 'records');

// configure middlewares
// set
app.set('port', process.env.PORT || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine

// use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static('/')); // configure express to use public folder
app.use('/', express.static(__dirname + '/public/'));
app.use(cookieParser());
app.use(cors());
// configure fileupload
app.use(
  session({
    secret: "Secret Code Don't Tell Anyone",
    cookie: { maxAge: 30 * 1000 },
    resave: true,
    saveUninitialized: true,
  }),
);
app.use(upload());
app.use('/api', api);

////////////////////////////////////////////////////////
// Routes for the App:
////////////////////////////////////////////////////////

// define routes:
const {
  getHomePage,
  getLiveStreamPage,
  getHostPage,
  getDataPage,
  get404Page,
} = require('./routes/app');

// get
app.get('/', getHomePage);
app.get('/data-visualization', getDataPage);
app.get('/live-stream', getLiveStreamPage);
app.get('/live-stream/host', getHostPage);

// everything else -> 404
app.get('*', get404Page);

////////////////////////////////////////////////////////
// Start Server:
////////////////////////////////////////////////////////
// var server = app.listen(port, () => {
//     console.log("Server is listening on:\t"+hostname+':'+port);
// });

//load page
var server = http.listen(app.get('port'), () => {
  console.info('==> 🌎  Go to http://localhost:%s', app.get('port'));
});

////////////////////////////////////////////////////////
// Web-socket:
////////////////////////////////////////////////////////
var io = require('socket.io').listen(server);

// web-socket
require('./controllers/live-stream/main.js')(io);
