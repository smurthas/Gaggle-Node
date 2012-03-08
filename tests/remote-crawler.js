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
      worker.init(12345, function() {
        crawler.init([12345], function() {
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
      users.getCollection(global.user._id, 'facebook', 'photos').count({}, function(err, photosCount) {
        if(err) return cb(err);
        users.getCollection(global.user._id, 'facebook', 'albums').count({}, function(err, albumsCount) {
          if(err) return cb(err);
          users.getCollection(global.user._id, 'facebook', 'photos').find({}).toArray(function(err, array) {
            if(err) return cb(err);
            cb(undefined, {albumsCount:albumsCount, photosCount:photosCount, photos: array});
          });
        });
      });
    },
    'get saved in db': function(err, info) {
      console.error("DEBUG: info.photos", info.photos);
      assert.equal(info.photosCount, 25);
      assert.equal(info.albumsCount, 2);
    }
  }
}).export(module);