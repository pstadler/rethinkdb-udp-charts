# Real-time charts using RethinkDB changefeeds

This is an experiment using RethinkDB changefeeds to push data via websockets to browser clients. The endpoint for gathering data is a simple UDP listener.

## Setup

```bash
$ npm install

# Start RethinkDB
$ rethinkdb
```

## Usage

```
$ npm start
# Open http://localhost:8080 in a browser

# Push metrics to the UDP endpoint, e.g.
$ echo "some_metric=12.34" | nc -u -w0 127.0.0.1 8888
```