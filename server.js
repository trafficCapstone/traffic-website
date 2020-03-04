////////////////////////////////////////////////////////
// Set up:
////////////////////////////////////////////////////////

// local imported libraries
const bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  cors = require('cors'),
  express = require('express'),
  upload = require('express-fileupload'),
  session = require('express-session'),
  http_module = require('http'),
  mongoose = require('mongoose'),
  path = require('path');

const {
  main: {
    development: { connectionString },
  },
} = require('./credentials');
const api = require('./routes/api');
const {
  getHomePage,
  getLiveStreamPage,
  getHostPage,
  getDataPage,
  get404Page,
} = require('./routes/app');

// Set port number and hostname
const PORT = 8081;
const HOST = 'http://localhost';

// Initialize express app and http server
const app = express();
const http = http_module.Server(app);

// Set base path globally
global.app_path = path.join(__dirname, 'public');
if (global.app_path.includes(':')) {
  global.app_path = path.join(__dirname, 'public').split(':')[1];
}

console.log(global.app_path);

// get path
global.currentPath = process.cwd();
global.dataFolder = currentPath + '/data/';

// configure middlewares
// set
app.set('port', process.env.PORT || PORT); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine

// use
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static('/')); // configure express to use public folder
app.use('/', express.static(__dirname + '/public/'));
app.use(cookieParser());
app.use(cors());
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

// get
app.get('/', getHomePage);
app.get('/data', getDataPage);
app.get('/live-stream', getLiveStreamPage);
app.get('/live-stream/host', getHostPage);

// everything else -> 404
app.get('*', get404Page);

////////////////////////////////////////////////////////
// Database Setup:
////////////////////////////////////////////////////////

const opts = {
  server: {
    socketOptions: { keepAlive: 1 },
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(connectionString, opts, err => {
  if (err) console.error(err.message);
});

////////////////////////////////////////////////////////
// Start Server:
////////////////////////////////////////////////////////
const server = http.listen(app.get('port'), () => {
  console.info(`==> 🌎  Go to http://localhost:${app.get('port')}`);
});

////////////////////////////////////////////////////////
// Web-socket:
////////////////////////////////////////////////////////
const io = require('socket.io').listen(server);

// web-socket
require('./controllers/live-stream/main.js')(io);
