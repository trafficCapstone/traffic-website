////////////////////////////////////////////////////////
// WebSocket
////////////////////////////////////////////////////////
module.exports = function(io) {
  ////////////////////////////////////////////////////////
  //// running demo and send outputs to client
  ////////////////////////////////////////////////////////
  // Run object detection python script.
  var spawn = require('child_process').spawn;
  var process = spawn('/home/madebymaze/miniconda2/bin/python2', [
    '/home/madebymaze/Projects/capstone/traffic-analysis/cv/all/main.py',
  ]);

  // socket connection to run the demo
  io.on('connection', socket => {
    console.log('Socket: ' + socket.id + ' (connected)');

    process.on('close', code => {
      socket.emit('output', 'DONE');
    });
    socket.emit('start_stream', 'START output');

    socket.on('frame-to-server', data => {
      //console.log(data.toString().length);
      socket.broadcast.emit('frame-from-server', data.toString());
    });
    socket.on('objects-to-server', data => {
      // console.log(data.toString());
      //console.log(data.toString().length);
      socket.broadcast.emit('objects-from-server', JSON.parse(data.toString()));
    });
    socket.on('welcome', data => {
      console.log(data);
    });
    ////////////////////////////////////////////////////////
    //// running demo and send outputs to client
    ////////////////////////////////////////////////////////
    // socket.on('run_stream', (data) => {
    //     // Run object detection python script.
    //     var spawn = require('child_process').spawn;
    //     var process = spawn('/home/madebymaze/miniconda2/bin/python2', ['/home/madebymaze/Projects/capstone/new/all/main.py']);
    //     // var process = spawn('/home/r-mutt/miniconda3/bin/python', ['/home/r-mutt/Github/real-time-object-detection/test_sockets.py']);

    //     process.stdout.on("data", (data) => {
    //         // console.log(data.toString());
    //         // socket.broadcast.emit("objects-from-server", data.toString());
    //         // socket.emit("stream-frame", data.toString());
    //     });

    //     process.on('close', (code) => {
    //         socket.emit('output', "DONE");
    //     });
    //     socket.emit('start_stream', 'START output');
    // });
  });
};
