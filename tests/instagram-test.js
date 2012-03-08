var vows = require('vows');
var assert = require('assert');
var clean = require(__dirname + '/utils/clean');
var instagram = require(__dirname + '/../crawlers/instagram.js')

require(__dirname + '/fixtures/instagram/fake.js')

var fs = require('fs');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The Instagram Crawler').addBatch(clean).addBatch({
  'when syncing from instagram': {
    topic: function() {
      instagram.sync(user.instagram, this.callback)
    },
    'returns photos': function(err, datas) {
      assert.notEqual(typeof err, Object);
      assert.equal(datas[0].type,'photo');
      assert.equal(datas[0].data.length, 30);
    }
  }
}).export(module);