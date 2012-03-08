var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var tw = require(__dirname + '/../crawlers/twitter.js')

require(__dirname + '/fixtures/twitter/fake.js')

var fs = require('fs');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The Twitter Crawler').addBatch(clean).addBatch({
  'when syncing from twitter': {
    topic: function() {
      tw.sync(user.twitter, this.callback)
    },
    'returns tweets': function(err, datas) {
      assert.notEqual(typeof err, Object);
      assert.equal(datas[0].type,'status');
      assert.equal(datas[0].data.length, 309);
    }
  }
}).export(module);