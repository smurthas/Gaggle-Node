var async = require('async');
var dnode = require('dnode');
var argv = require('optimist').argv;
var listenPort = argv.p;

var crawler = require('crawler');

var server = dnode({
    crawl : crawler.crawl
});

module.exports.init = function(port, callback) {
  crawler.init(function(err) {
    server.listen(port);
    callback();
  });
};

module.exports.stop = function() {
  server.close();
}

if(listenPort) module.exports.init(listenPort, function() {
  console.log('listening on ', listenPort);
});