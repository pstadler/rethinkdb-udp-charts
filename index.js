var db = require('./db')
  , listener = require('./listener')
  , web = require('./web')
  , config = require('./config');

db.connect(config.rethinkdb)
  .then(function() {
    listener.start(config.listener);
    web.serve(config.web);
  });
