var express = require('express');
var connect = require('connect');
var Duplex = require('stream').Duplex;
var SockStream = require('../../').SockStream;
var sharejs = require('share');
var browserify = require('browserify-middleware');
var enchilada = require('enchilada');

var createInstance = function() {
  var redis = require('redis').createClient();
  redis.flushdb();

  var livedbLib = require('livedb');
  var memorydb = livedbLib.memory();
  var livedb = livedbLib.client({
    db: memorydb,
    redis: redis
  });
  return sharejs.server.createClient({
    backend: livedb
  });
};

var share = createInstance();

var sockServer = require('sockjs').createServer({
  sockjs_url: 'http://cdn.sockjs.org/sockjs-0.3.min.js'
});

sockServer.on('connection', function(conn) {
  return share.listen(new SockStream(conn, {
    debug: true
  }));
});

var app = express()
  .use(connect.logger('dev'))
  .use(enchilada(__dirname))
  .use(connect["static"](__dirname))
  .use(connect["static"](sharejs.scriptsDir))
  .listen(3000, function(error) {
      if (error) return console.error(error);
      console.log('ShareJS with SockJS example is running on http://localhost:3000');
  });

sockServer.installHandlers(app, {
  prefix: '/sock'
});