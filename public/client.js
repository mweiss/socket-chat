(function() {
  var pathParts = window.location.pathname.split("/");
  var roomName = pathParts[pathParts.length - 1];
  var socket = io();

  socket.emit('subscribe to room', roomName)

  $('form').submit(function(){
    console.log('sending chat message', $('#m').val())
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg));
  });

  // Let's append a message so we can invite others.
  var href = window.location.href;
  var subject = encodeURIComponent('Let\'s chat!')
  var body = encodeURIComponent('Hey, click this link so we can chat: ' + href);
  var mailToLink = 'mailto:someone@example.com?subject=' + subject + '&body=' + body;

  $('#messages').append($('<li>Share this link to chat with others: <a href="' + mailToLink + '">' + href + '</a></li>'))
})();