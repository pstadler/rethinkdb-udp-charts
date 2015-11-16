var r = require('rethinkdb');

var _conn;

exports.connect = function connect(config) {
  return r.connect(config)
    .then(function(conn) {
      _conn = conn;
    })
    .then(function() {
      return r.tableDrop('entries').run(_conn)
        .catch(function() {})
        .then(function() {
          return r.tableCreate('entries').run(_conn);
        })
        .catch(function(err) {
          throw err;
        })
        .finally(function(result) {
          console.log('RethinkDB ready');
        });
    })
    .catch(function(err) {
      throw err;
    });
};

exports.writeMetric = function writeMetric(name, value) {
  return r.table('entries').insert({
    name: name,
    value: parseFloat(value),
    time: new Date()
  }).run(_conn);
};

exports.changes = function changes(cb) {
  r.table('entries').changes().run(_conn)
    .then(function(cursor) {
      cursor.each(function(err, row) {
        if(err) {
          return;
        }

        row = row.new_val;
        cb({ name: row.name, value: row.value, time: row.time.valueOf() });
      });
    });
};