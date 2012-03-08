var EventEmitter = require('events').EventEmitter;

var express = require('express');
var connect = require('connect');

var config = require('config');

var mongo = require('mongo');
var crawlerClient = require('crawlerClient');
var usersCollection;

var app = express.createServer(connect.bodyParser());

module.exports = new EventEmitter();

app.post('/start', function(req, res) {
  var _id = req.body._id;
  var provider =  req.body.provider;
  if (!_id) return res.send('_id required', 400);
  if (!provider) return res.send('provider required', 400);
  mongo.getCollection('users').findOne({_id: new mongo.ObjectID(_id)}, function(err, user) {
    if (err) return res.send(err, 500);
    if (!user) return res.send('user with _id ' + _id + ' not found', 400);
    crawlerClient.crawl(user, provider, function() {
      res.send(200);
    });
  });
});

mongo.connect(function(err) {
  if (err) throw err;
  crawlerClient.init(config.dnode.workers, function() {
    app.listen(config.app.port);
    module.exports.emit('up');
  });
});