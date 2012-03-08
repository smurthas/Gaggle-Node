var dnode = require('dnode');
var async = require('async');

var remotes = {};

exports.addWorker = function(port, callback) {
  dnode.connect(port, function (remote) {
    remotes[port] = remote;
    console.log('added worker on', port);
    callback();
  });
}

exports.removeWorker = function(port, callback) {
  delete remotes[port];
}

exports.stop = function(callback) {
  for(var i in remotes) {

    // todo close the socket
    // remotes[i].end();
  }
  remotes = [];
}

var remote = 0;
exports.crawl = function(user, provider, callback) {
  remote++;
  var remoteKeys = Object.keys(remotes);
  if(remote >= remoteKeys.length) remote = 0;
  console.log('round robinning to remote', remote);
  rem = remotes[remoteKeys[remote]];
  rem.crawl(user, provider, callback);
}

exports.init = function(workerPorts, callback) {
  async.forEach(workerPorts, function(workerPort, callback) {
    exports.addWorker(workerPort, callback);
  }, callback);
}