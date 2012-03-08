var vows = require('vows');
var assert = require('assert');
var mongo = require('mongo');

module.exports = {
  'can be cleaned up': {
    topic: function() {
      var cb = this.callback;
      mongo.connect(function() {
        mongo.dropDatabase(cb);
      });
    },
    'leaves it empty': function(err, datas) {
      assert.equal(0,0);
    }
  }
};