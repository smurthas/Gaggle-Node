var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var fb = require(__dirname + '/../crawlers/facebook.js')

require(__dirname + '/fixtures/facebook/fake.js')

var fs = require('fs');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The Facebook Crawler').addBatch(clean).addBatch({
  'when syncing from facebook': {
    topic: function() {
      fb.sync(user.facebook, this.callback)
    },
    'returns albums and photos': function(err, datas) {
      assert.notEqual(typeof err, Object);
      assert.equal(datas.data[0].type,'photo');
      assert.equal(datas.data[0].data.length, 25);
      assert.equal(datas.data[1].type,'status');
      assert.equal(datas.data[1].data.length, 165);
    }
  }
}).export(module);