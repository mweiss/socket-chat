var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var randomWords = require('random-words');

/**
 * Expose the public directory.
 */
app.use('/public', express.static('public'));

/**
 * If you go to the base site, we'll auto generate a chat room for you.
 */
app.get('/', function(req, res){
  res.redirect('/c/' + randomWords({exactly: 2, join: '-'}));
});

/**
 *  This initializes a chat room for the given URL.  Chatrooms are prefixed with /c/:roomName
 */
app.get('/c/:roomName', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

/**
 * Helper method to log messages with the socket id.
 */
function logWithSocket(socket, msg) {
  console.log('[' + socket.id + ']: ' + msg);
}

/**
 * Add listeners when the user connects.  The user will first tell the server
 * what room it's in so we can correctly filter messages.
 */
io.on('connection', function(socket){
  logWithSocket(socket, 'Connected!');
  socket.broadcast.emit('hi');

  var room;

  socket.on('chat message', function(msg){
    logWithSocket(socket, 'message: ' + msg);
    if (room) {
      io.to(room).emit('chat message', msg);
    }
  });

  socket.on('subscribe to room', function(r) {
    room = r;
    socket.join(room);
  });

});

/**
 *  Start the server.
 */
var port = (process.env.PORT || 5000);
http.listen(port, function(){
  console.log('listening on *:' + port);
});
