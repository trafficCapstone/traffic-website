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

        socket.on('stream',function(image){
            socket.broadcast.emit('stream',image);
        });
        
        // when user join, send confirmation message
        socket.on('join', (data) => {
            console.log(data);
            socket.emit('messages', 'Hello from server');
        });

        // socket.on("welcome", (data) => {
        //     console.log(data);
        // });

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
        /*socket.on('outputs_1', (data) => {
            var spawn = require('child_process').spawn;
            var process = spawn('bash', [
                './public/bash/outputs.sh',
                data.project,
                data.gpu
            ]);
            var output_1 = '';
            process.stdout.on('data', (output) => {
                output_1 += output.toString();
            });
            var demo_1 = setInterval(() => {
                socket.emit('outputs_1_outputs', output_1);
                output_1 = '';
            }, 5000);
            process.on('close', (code) => {
                socket.emit('outputs_1_outputs', output_1);
                output_1 = '';
                clearInterval(demo_1);
            });
            //socket.emit('messages', 'START outputs_2');
            socket.emit('output_1_start', 'START outputs_1');
        });*/
    });
}

