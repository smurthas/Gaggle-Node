var vows = require('vows');
var assert = require('assert');
var fb = require(__dirname + '/../crawlers/facebook.js')

var fs = require('fs');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The Facebook Crawler').addBatch({
  'when syncing from facebook': {
    topic: function() {
      fb.sync(user.facebook, this.callback)
    },
    'returns albums and photos': function(err, datas) {
      assert.notEqual(typeof err, Object);
      assert.notEqual(datas.albums.length, 0);
      assert.notEqual(datas.photos.length, 0);
    }
  }
}).export(module);