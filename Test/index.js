
const express = require('express');

const app = express();

const path = require('path');

const http = require('http').Server(app);

const io = require('socket.io')(http);


var temp = 0;
var tempMax = 22;
var tempMin = 14;
var tempCen = 22;
var calibration = 0;

// Upon Lepton data arriving, build up a frame

setInterval(() => {
  io.emit('tempMax', tempMax+calibration);
  io.emit('tempMin', tempMin+calibration);
  io.emit('tempCen', tempCen+calibration);
  io.emit('ambTemp', '35');	
  io.emit('distance', temp);
  console.log(calibration)
}, 1000/9);


io.on('connection', function (socket) {
  socket.on('calibration', function(msg) {
    calibration = msg;
  });
});


app.get('/', (req, res) => {

res.sendFile(__dirname + '/index.html');

});

app.use('/assets', express.static(path.join(__dirname, 'assets')))

http.listen(3000);

