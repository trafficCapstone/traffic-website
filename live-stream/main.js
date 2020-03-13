////////////////////////////////////////////////////////
// Setup
////////////////////////////////////////////////////////
////////////////////////////////////////////////////////
// WebSocket
////////////////////////////////////////////////////////
module.exports = function(io){

    // socket connection to run the demo
    io.on('connection', (socket) => {
        console.log('Socket: '+socket.id+' (connected)'); // printServer: when client is connected

        // socket.on('stream',function(image){
        //     socket.broadcast.emit('stream',image);
        // });
        
        // socket.on('frame', (data) => {
        //     // console.log(data);
        //     socket.emit("stream-frame", data.toString());
        // });

        socket.on("welcome", (data) => {
            console.log(data);
        });

        ////////////////////////////////////////////////////////
        //// Request page set up
        ////////////////////////////////////////////////////////
        socket.on('send_date', (data) => {
            console.log("send_date");
            console.log(parseInt(data));
            // changed SELECT request_date to SELECT *
            let query = "SELECT * FROM requests;"; // query database to get all the players
            // execute query
            db.all(query, [], (err, result) => {
                console.log("sent_date -> query");
                if (err) {
                    console.log("sent_date -> query (ERROR)");
                }
                socket.emit('get_times', result);
            });
        });
        ////////////////////////////////////////////////////////
        //// running demo and send outputs to client
        ////////////////////////////////////////////////////////
        socket.on('run_stream', (data) => {
            // Run object detection python script.
            var spawn = require('child_process').spawn;
            var process = spawn('/home/r-mutt/miniconda3/bin/python', ['/home/r-mutt/Github/real-time-object-detection/cam_demo.py']);
            // var process = spawn('/home/r-mutt/miniconda3/bin/python', ['/home/r-mutt/Github/real-time-object-detection/test_sockets.py']);
            
            process.stdout.on("data", (data) => {
                console.log(data.toString().length);
                socket.emit("stream-frame", data.toString());
            });

            process.on('close', (code) => {
                socket.emit('output', "DONE");
            });
            socket.emit('start_stream', 'START output');
        });
    });
}

