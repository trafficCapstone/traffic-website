module.exports = {
  // home page
  getHomePage: async (req, res) => {
    console.log('getHomePage');
    console.log('User permission: ', req.cookies.webApp);

    const cameras = await global.CameraModel.find();

    res.render('camera-map', {
      title: 'camera-map',
      cameras: JSON.stringify(cameras),
      user: req.cookies.webApp,
    });
  },

  // LiveStream Host page
  getHostPage: (req, res) => {
    console.log('getHostPage');
    console.log('User permission: ', req.cookies.webApp);

    res.render('host', {
      title: 'host',
      user: req.cookies.webApp,
    });
  },

  // LiveStream page
  getLiveStreamPage: async (req, res) => {
    console.log('getLiveStreamPage');
    console.log('User permission: ', req.cookies.webApp);

    const cameras = await global.CameraModel.find();
    const id = req.query.id || 1;
    const camera = await global.CameraModel.findOne({ id });
    const objects = await global.ObjectModel.find();

    res.render('live-stream', {
      title: 'live-stream',
      cameras,
      objects,
      target: camera,
      classes: global.Classes,
      user: req.cookies.webApp,
    });
  },

  getDataPage: async (req, res) => {
    console.log('getDataPage');
    console.log('User permission: ', req.cookies.webApp);

    const trafficData = await global.TrafficModel.find();
    const objectData = await global.ObjectModel.find();

    res.render('data-visualization', {
      title: 'data-visualization',
      trafficData: JSON.stringify(trafficData),
      objectData: JSON.stringify(objectData),
      user: req.cookies.webApp,
    });
  },

  // 404 page
  get404Page: (req, res) => {
    console.log('get404Page');
    console.log('User permission: ', req.cookies.webApp);

    res.render('404', {
      title: '404',
      user: req.cookies.webApp,
    });
  },
};
