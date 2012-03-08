var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var addUser = require(__dirname + '/utils/addUser');
var crawler = require('crawlerClient');
var config = require('config');
var users = require(__dirname + '/../models/users');
var worker = require(__dirname + '/../worker');

require(__dirname + '/fixtures/facebook/fake.js')

var fs = require('fs');

vows.describe('Remote Crawler').addBatch(clean).addBatch(addUser)
.addBatch({
  'can sync from facebook': {
    topic: function() {
      var cb = this.callback;
      worker.init(12346, function() {
        crawler.init([12346], function() {
          crawler.crawl(global.user, 'facebook', cb);
        })
      })
    },
    'without an error': function(err) {
      assert.notEqual(typeof err, Object);
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