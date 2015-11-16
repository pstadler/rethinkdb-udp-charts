var http = require('http')
  , connect = require('connect')
  , serveStatic = require('serve-static')
  , socketIO = require('socket.io')
  , db = require('../db');

exports.serve = function(config) {
  var app = connect();

  app.use(serveStatic(__dirname));

  var server = http.createServer(app);

  var io = socketIO(server);

  io.on('connection', function(socket) {
    socket.emit('connected');
  });

  db.changes(function(entry) {
    io.sockets.emit('change', entry);
  });

  server.listen(config.port, config.host, function() {
    console.log('Serving web on ' + config.host + ':' + config.port);
  });
};