var vows = require('vows');
var fs = require('fs');
var assert = require('assert');
var request = require('request');
var config = require('config');
var addUser = require(__dirname + '/utils/addUser');
var users = require(__dirname + '/../models/users');
var clean = require(__dirname + '/utils/clean');
var worker = require(__dirname + '/../worker');

require(__dirname + '/fixtures/facebook/fake.js')

var server;

var mongo = require('mongo');


vows.describe('The JSON API').addBatch({
  'can start a web server': {
    topic: function() {
      var cb = this.callback;
      worker.init(config.dnode.workers[0], function() {
        server = require(__dirname + '/../server');
        server.on('up', cb);
      });
    },
    'successfully': function() {
      assert.equal(0,0);
    }
  }
}).addBatch(clean).addBatch(addUser).addBatch({
  'with a post to /start': {
    'without _id and provider': {
      topic: function() {
        request.post({uri:config.app.url + '/start'}, this.callback);
      },
      'gets 400': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 400);
        assert.equal(body, 'user_id required');
      }
    },
    'with an invalid _id': {
      topic: function() {
        request.post({uri:config.app.url + '/start', json: {user_id:'aaaaaaaaaaaa', provider:'facebook'}}, this.callback);
      },
      'gets 400': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 400);
        assert.equal(body, 'user with user_id aaaaaaaaaaaa not found');
      }
    },
    'with a valid _id': {
      topic: function() {
        request.post({uri:config.app.url + '/start', json: {user_id:global.user._id, provider:'facebook'}}, this.callback);
      },
      'gets 200': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 200);
      }
    }
  }
}).addBatch({
  'photos synced from fb': {
    topic: function() {
      var cb = this.callback;
      users.getCollection('posts').count({}, function(err, count) {
      if(err) return cb(err);
        users.getCollection('posts').find({}).toArray(function(err, array) {
          if(err) return cb(err);
          cb(undefined, {count:count, posts: array});
        });
      });
    },
    'get saved in db': function(err, info) {
      assert.equal(info.count, 27);
      assert.equal(info.posts.length, 27);
    }
  }
}).export(module);
