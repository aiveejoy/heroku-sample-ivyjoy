var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var population=[];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat', msg);
  });
  socket.on('online', function(msg){
    io.emit('chat online', msg);
  });
  socket.on('disconnect', function(msg){
    for(var i=0; i<population.length; i++){
      if (socket.id == population[i]){
        population.splice(i,1);
        break;
      }
    }
    var PL=population.length;
    io.emit('chat disC', PL);
  });
  socket.on('onlineCount', function(msg){
    population.push(msg);
    socket.id = msg;
    io.emit('onlineNumber',population.length);
  });
  socket.on('typing', function (username) {
    socket.broadcast.emit('typing', username)
  })
  socket.on('stop-typing', function (username) {
    socket.broadcast.emit('stop-typing', username)
  })
});
http.listen(port, function(){
  console.log('listening on *:' + port);
});