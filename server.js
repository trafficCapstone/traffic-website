////////////////////////////////////////////////////////
// Set up:
////////////////////////////////////////////////////////

// npm libraries
const bodyParser = require('body-parser'),
  cors = require('cors'),
  express = require('express'),
  http_module = require('http'),
  mongoose = require('mongoose'),
  path = require('path');

// local modules
const registerCameraModel = require('./models/camera'),
  registerObjectModel = require('./models/object'),
  registerRecordModel = require('./models/record'),
  registerTrafficModel = require('./models/traffic');
const api = require('./routes/api');

// Set port number and hostname
const PORT = process.env.PORT || 8081;
const HOST = 'http://localhost';

// Initialize express app and http server
const app = express();
const http = http_module.Server(app);

// configure middlewares
// set
app.set('port', PORT); // set express to use this port

// use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(cors());

app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.use('/api', api);

////////////////////////////////////////////////////////
// Routes for the App:
////////////////////////////////////////////////////////

// get
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

////////////////////////////////////////////////////////
// Database Setup:
////////////////////////////////////////////////////////

// Get Mongo credentials
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDBName = process.env.MONGO_DATABASE;

// Build Mongo URIs
const mongoURL = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoDBName}`;

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(mongoURL, opts).then(
  () => {
    ////////////////////////////////////////////////////////
    // Start Server:
    ////////////////////////////////////////////////////////
    const server = http.listen(app.get('port'), () => {
      console.info(`==> 🌎  Go to ` + HOST + `:${app.get('port')}`);
    });

    ////////////////////////////////////////////////////////
    // Web-socket:
    ////////////////////////////////////////////////////////
    const io = require('socket.io').listen(server);

    // web-socket
    // require('./controllers/live-stream/main.js')(io);
  },
  (err) => {
    console.error(err.message);
  },
);
