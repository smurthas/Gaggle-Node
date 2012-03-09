var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var addUser = require(__dirname + '/utils/addUser');
var crawler = require('crawler');
var users = require(__dirname + '/../models/users');

require(__dirname + '/fixtures/facebook/fake.js')
require(__dirname + '/fixtures/twitter/fake.js')

var fs = require('fs');

vows.describe('Crawler').addBatch(clean).addBatch(addUser)
.addBatch({
  'can init crawler': {
    topic: function() {
      crawler.init(this.callback)
    },
    'without an error': function(err) {
      assert.notEqual(typeof err, Object);
    }
  }
})
.addBatch({
  'can sync from facebook': {
    topic: function() {
      var cb = this.callback;
      crawler.crawl(global.user, 'facebook', function(err) {
        if (err) return cb(err);
        users.get(global.user._id.toString(), function(err, user) {
          users.getCollection('posts').count({}, function(err, count) {
            cb(err, {count:count, last_update:user.facebook.last_update});
          });
        });
      });
    },
    'get saved in db': function(err, info) {
      assert.equal(info.count, 96);
      assert.isTrue(info.last_update > 1331269882);
    }
  }
})
.addBatch(clean).addBatch(addUser)
.addBatch({
  'can sync from twitter': {
    topic: function() {
      var cb = this.callback;
      crawler.crawl(global.user, 'twitter', function(err) {
        if (err) return cb(err);
        users.get(global.user._id.toString(), function(err, user) {
          users.getCollection('posts').count({}, function(err, count) {
            cb(err, {count:count, last_update:user.twitter.last_update});
          });
        });
      });
    },
    'get saved in db': function(err, info) {
      assert.equal(info.count, 309);
      assert.equal(info.last_update, 177498760828555260);
    }
  }
})
.addBatch(clean).addBatch(addUser)
.addBatch({
  'can sync from instagram': {
    topic: function() {
      var cb = this.callback;
      crawler.crawl(global.user, 'instagram', function(err) {
        if (err) return cb(err);
        users.get(global.user._id.toString(), function(err, user) {
          users.getCollection('posts').count({}, function(err, count) {
            cb(err, {count:count, last_update:user.instagram.last_update});
          });
        });
      });
    },
    'get saved in db': function(err, info) {
      assert.equal(info.count, 30);
      assert.isTrue(info.last_update > 1331269882);
    }
  }
})
.export(module);
