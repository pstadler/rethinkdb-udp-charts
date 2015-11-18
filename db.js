'use strict';
const r = require('rethinkdb');

var _conn;

module.exports = {
    connect(config) {

        return r.connect(config)
            .then((conn) => {
                _conn = conn;
            })
            .then(() => {
                return r
                    .tableDrop('entries')
                    .run(_conn)
                    .catch(function () {
                    })
                    .then(() => r.tableCreate('entries').run(_conn))
                    .catch((err) => {
                        throw err;
                    })
                    .finally((result) => {
                        console.log('RethinkDB ready');
                    });
            })
            .catch((err) => {
                throw err
            });
    },

    writeMetric(name, value) {
        return r.table('entries').insert({
            name: name,
            value: parseFloat(value),
            time: new Date()
        }).run(_conn);
    },

    changes(cb) {
        r.table('entries').changes().run(_conn)
            .then(function (cursor) {
                cursor.each((err, row) => {
                    if (err) {
                        return;
                    }

                    row = row.new_val;
                    cb({name: row.name, value: row.value, time: row.time.valueOf()});
                });
            });
    }

};

