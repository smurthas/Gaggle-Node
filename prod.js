var forever = require('forever');

var child = new (forever.Monitor)('server.js', {
  options: []
});

child.on('exit', this.callback);
child.start();