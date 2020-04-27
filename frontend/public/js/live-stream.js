var client = io();
client.emit('join', 'hello world from client'); 	
// client.emit('run_stream', {temp: "something"});
client.on('messages', (data) => {
    console.log('messages: '+data);
});
client.on('frame-from-server', (data) => { 	
    utf8_encoded = data.toString('utf8');
    png_encoded = "data:image/jpeg;base64, " + utf8_encoded;
    var img = document.getElementById("play");
    img.src = png_encoded;
});
client.on('objects-from-server', (data) => {
    $("#class-conf tbody tr").remove();  	
    // console.log(data);
    for (var i = 0; i < data.length; i += 1) {
        // console.log(data[i])
        // console.log(data[i][0], data[i][1], JSON.parse(data[i][2]))
        var class_name = data[i][0],
            conf = data[i][1],
            color = JSON.parse(data[i][2]);
        $("#class-conf tbody").append(
            '<tr style="background-color: rgb('+color[0]+','+color[1]+','+color[2]+')"><td>'+class_name+'</td><td>'+conf+'</td></tr>'
        );
    }
});