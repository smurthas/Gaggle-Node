var async = require('async');
var dnode = require('dnode');
var argv = require('optimist').argv;
var listenPort = argv.p;

var crawler = require('crawler');

var server = dnode({
    crawl : crawler.crawl
});

crawler.init(function(err) {
  server.listen(listenPort);
});
