var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomWords = require('random-words');

app.use('/public', express.static('public'));

app.get('/', function(req, res){
  res.redirect('/c/' + randomWords({exactly: 2, join: '-'}));
});

app.get('/c/:roomName', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket, testOptions){
  console.log('connected!');
  socket.broadcast.emit('hi');

  var room;

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    if (room) {
      io.to(room).emit('chat message', msg);
    }
  });
  socket.on('subscribe to room', function(r) {
    room = r;
    socket.join(room);
  })
});
var port = (process.env.PORT || 5000);
http.listen(port, function(){
  console.log('listening on *:30051');
});
