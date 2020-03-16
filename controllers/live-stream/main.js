////////////////////////////////////////////////////////
// WebSocket
////////////////////////////////////////////////////////
module.exports = function(io){
    ////////////////////////////////////////////////////////
    //// running demo and send outputs to client
    ////////////////////////////////////////////////////////
    // Run object detection python script.
    // const path = require('path');
    // function resolveHome(filepath) {
    //     if (filepath[0] === '~') {
    //         return path.join(process.env.HOME, filepath.slice(1));
    //     }
    //     return filepath;
    // }
    const home_dir = require('os').homedir();
    console.log((home_dir.toString()+'/Github/traffic-all/main.py').toString());
    var spawn = require('child_process').spawn;
    var process = spawn('/usr/bin/python3', [(home_dir.toString()+'/Github/traffic-all/main.py').toString()]);
    
    // socket connection to run the demo
    io.on('connection', (socket) => {
        console.log('Socket: '+socket.id+' (connected)');

        process.on('close', (code) => {
            socket.emit('output', "DONE");
        });
        socket.emit('start_stream', 'START output');
        
        socket.on('frame-to-server', (data) => {
            const utf8_encoded = data.toString('utf8');
            console.log(utf8_encoded.length);
            socket.broadcast.emit("frame-from-server", utf8_encoded.substring(2, data.toString().length-1));
        });
        socket.on('objects-to-server', (data) => {
            // console.log(data.toString());
            //console.log(data.toString().length);
            socket.broadcast.emit("objects-from-server", JSON.parse(data.toString()));
        });
        socket.on("welcome", (data) => {
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
}

