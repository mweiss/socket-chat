(function () {
  var pathParts = window.location.pathname.split("/");
  var roomName = pathParts[pathParts.length - 1];
  var socket = io();

  // Let the server know what room we're in.
  socket.emit('subscribe to room', roomName)

  var anonName = 'Anonymous' + Math.floor((Math.random() * 100000000) + 1);
  $('#name').val(Cookies.get('name') || anonName);

  function getName() {
    return $('#name').val() || anonName;
  }

  $('#name').on('change', function() {
    Cookies.set('name', getName());
  });

  $('form').submit(function(){
    socket.emit('chat message', {message: $('#m').val(), name: getName(), id: socket.io.engine.id});
    $('#m').val('');
    return false;
  });

  // When we receive a message, append it to the list of messages.
  socket.on('chat message', function(msg){
    var isMe = socket.io.engine.id === msg.id;
    var name = isMe ? "Me" : msg.name;

    var nameEle = $('<span class="name">').text(name + ':');
    var messageEle = $('<span class="msg">').text(msg.message);

    $('#messages').append($('<li>').append(nameEle).append(messageEle));
  });

  // We'll append a message to the beginning of the chat so the user can invite others.
  var href = window.location.href;
  var subject = encodeURIComponent('Let\'s chat!');
  var body = encodeURIComponent('Hey, click this link so we can chat: ' + href);
  var mailToLink = 'mailto:someone@example.com?subject=' + subject + '&body=' + body;

  $('#messages').append($('<li>Share this link to chat with others: <a href="' + mailToLink + '">' + href + '</a></li>'))
})();