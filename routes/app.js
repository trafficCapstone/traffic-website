////////////////////////////////////////////////////////
// App - Routes
////////////////////////////////////////////////////////
module.exports = {
  // home page
  getHomePage: async (req, res) => {
    console.log('getHomePage');
    console.log('User permission: ', req.cookies.webApp);
    //
    var public_path = __dirname.replace('routes', '');
    // get URL variables
    //var PID = req.query.PID;

    const cameras = await CameraModel.find();

    res.render('camera-map', {
      cameras: JSON.stringify(cameras),
      user: req.cookies.webApp,
    });
  },

  // LiveStream Host page
  getHostPage: (req, res) => {
    console.log('getHostPage');
    console.log('User permission: ', req.cookies.webApp);
    //
    var public_path = __dirname.replace('routes', '');
    // get URL variables
    //var PID = req.query.PID;
    res.render('host', {
      user: req.cookies.webApp,
    });
  },

  // LiveStream page
  getLiveStreamPage: (req, res) => {
    console.log('getLiveStreamPage');
    console.log('User permission: ', req.cookies.webApp);
    //
    var public_path = __dirname.replace('routes', '');
    // get URL variables
    //var PID = req.query.PID;
    res.render('live-stream', {
      user: req.cookies.webApp,
    });
  },

  getDataPage: (req, res) => {
    console.log('getDataPage');
    console.log('User permission: ', req.cookies.webApp);
    //
    var public_path = __dirname.replace('routes', '');
    // get URL variables
    //var PID = req.query.PID;
    res.render('data-visualization', {
      user: req.cookies.webApp,
    });
  },

  // 404 page
  get404Page: (req, res) => {
    console.log('get404Page');
    console.log('User permission: ', req.cookies.webApp);
    //
    var public_path = __dirname.replace('routes', '');
    // get URL variables
    //var PID = req.query.PID;
    res.render('404', {
      user: req.cookies.webApp,
    });
  },
};
