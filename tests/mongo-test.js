var vows = require('vows');
var fs = require('fs');
var assert = require('assert');
var request = require('request');
var config = require('config');

var mongo = require('mongo');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

vows.describe('The mongo lib').addBatch({
  'can connect to mongo': {
    topic: function() {
      var cb = this.callback;
      mongo.connect(cb);
    },
    'successfully': function() {
      assert.isNotNull(mongo.getCollection('users'));
    }
  }
}).export(module);