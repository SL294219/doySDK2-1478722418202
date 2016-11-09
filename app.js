/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

//http와 socket.io를 사용 
var http = require ('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('Client connected');
  socket.on('P', function(msg) {
    console.log('P: ' + {'nick': socket.nick, 'text': msg});
    io.emit('P', {'nick': socket.nick, 'text': msg});
  });
  socket.on('N', function(newnick) {
    io.emit('P', {'nick':  socket.nick, 'text': '-> <' + newnick + '>'});
    socket.nick = newnick;
  });
  socket.nick = 'User' + Math.floor(Math.random() * 1000);
});


// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
