// SockJS Adapter
// --------------
//
// Usage:
//   var sockServer = sockjs.createServer();
//   sockServer.on('connection', function (conn) {
//     shareServer.listen(sockStream(conn));
//   });
//

var duplex = require('read-write-stream');

var sockStream = module.exports = function (connection) {
    // Check for connection object
    if (connection == null) throw new Error('No connection object provided.');

    var queue = duplex(function write(chunk) {
        connection.write(JSON.stringify(chunk));
    }, function end() {
        connection.write('__GOODBYE__');
        setTimeout(connection.close.bind(connection), 10);
    });

    connection.on('data', function(chunk) {
        chunk = JSON.parse(chunk);
        if (chunk === '__GOODBYE__') {
            queue.end()
            connection.close()
        } else {
            queue.push(chunk)
        }
    });

    // Save the connection object into the stream object for later use
    queue.stream.connection = connection;
    return queue.stream;
};
