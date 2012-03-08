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
  'can setup': {
    topic: function() {
      var cb = this.callback;
      worker.init(12346, function() {
        crawler.init([12346], cb);
      });
    },
    'without and error': function(err) {
      assert.notEqual(typeof err, Object);
    }
  }
}).addBatch({
  'can sync from facebook': {
    topic: function() {
      crawler.crawl(global.user, 'facebook', this.callback);
    },
    'without an error': function(err) {
      assert.notEqual(typeof err, Object);
    }
  }
}).addBatch({
  'photos synced from facebook': {
    topic: function() {
      users.getCollection('posts').count({}, this.callback);
    },
    'get saved in db': function(err, count) {
      assert.equal(count, 85);
    }
  }
}).addBatch(clean).addBatch(addUser)
.addBatch({
  'can sync from twitter': {
    topic: function() {
      crawler.crawl(global.user, 'twitter', this.callback);
    },
    'without an error': function(err) {
      assert.notEqual(typeof err, Object);
    }
  }
}).addBatch({
  'photos synced from twitter': {
    topic: function() {
      users.getCollection('posts').count({}, this.callback);
    },
    'get saved in db': function(err, count) {
      assert.equal(count, 309);
    }
  }
})
.export(module);