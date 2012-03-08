var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var addUser = require(__dirname + '/utils/addUser');
var crawler = require('crawler');
var users = require(__dirname + '/../models/users');

require(__dirname + '/fixtures/facebook/fake.js')

var fs = require('fs');

vows.describe('Crawler').addBatch(clean).addBatch(addUser)
.addBatch({
  'can sync from facebook': {
    topic: function() {
      var cb = this.callback;
      crawler.init(function() {
        crawler.crawl(global.user, 'facebook', cb);
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
      assert.equal(info.photosCount, 25);
      assert.equal(info.albumsCount, 2);
    }
  }
}).export(module);