var dgram = require('dgram')
  , db = require('./db');

var server = dgram.createSocket('udp4');

server.on('listening', function() {
    var address = server.address();
    console.log('UDP server listening on ' + address.address + ":" + address.port);
});

server.on('message', function(message) {
  message = message.toString().replace('\n', '').split('=');

  db.writeMetric(message[0], message[1]);
});

exports.start = function start(config) {
  server.bind(config.port, config.host);
};
