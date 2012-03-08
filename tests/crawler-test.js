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
        users.getCollection('posts').count({}, cb);
      });
    },
    'get saved in db': function(err, count) {
      assert.equal(count, 83);
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
        users.getCollection('posts').count({}, cb);
      });
    },
    'get saved in db': function(err, count) {
      assert.equal(count, 309);
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
        users.getCollection('posts').count({}, cb);
      });
    },
    'get saved in db': function(err, count) {
      assert.equal(count, 30);
    }
  }
})
.export(module);