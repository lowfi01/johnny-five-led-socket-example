const five = require('johnny-five');
const board = five.Board();

const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, 'public');
const port = 3000;
var app = express();

var server = http.createServer(app)
var io = socketIO(server);
app.use(express.static(publicPath));


app.get('/', function (req, res) {
  res.sendFile(path.join(publicPath, 'index.html'))
});


board.on('ready', function() {

  const led = new five.Led(13); // Set pin 13 for LED

  let on = () => {
    led.on();
  }
  let off = () => {
    led.off();
  }

  io.on('connection', function (socket) {
    socket.emit('join', { message: 'handshake confirmed' });

    socket.on('on', function (data) {
      // console.log(data);
      console.log('turning on');
      on();
    });

    socket.on('off', function (data) {
      // console.log(data);
      console.log('turning off');
      off();
    });
  });


});


server.listen(port, () => {
  console.log("Running on local host ", port)
});

