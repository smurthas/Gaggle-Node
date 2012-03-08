var EventEmitter = require('events').EventEmitter;

var express = require('express');
var connect = require('connect');

var config = require('config');

var mongo = require('mongo');
var crawlerClient = require('crawlerClient');
var usersCollection;

var app = express.createServer(connect.bodyParser(), connect.logger());

module.exports = new EventEmitter();

app.post('/start', function(req, res) {
  var user_id = req.body.user_id;
  var provider =  req.body.provider;
  if (!user_id) return res.send('user_id required', 400);
  if (!provider) return res.send('provider required', 400);
  mongo.getCollection('users').findOne({_id: new mongo.ObjectID(user_id)}, function(err, user) {
    if (err) return res.send(err, 500);
    if (!user) return res.send('user with user_id ' + user_id + ' not found', 400);
    console.log('calling crawler with user', user._id, 'provider' + provider);
    crawlerClient.crawl(user, provider, function(err) {
      if (err) return res.send(err, 500);
      res.send(200);
    });
  });
});

mongo.connect(function(err) {
  if (err) throw err;
  crawlerClient.init(config.dnode.workers, function() {
    app.listen(config.app.port);
    console.log('listening on ', config.app.port);
    module.exports.emit('up');
  });
});

module.exports.close = function() {
  app.close();
  crawlerClient.stop();
}