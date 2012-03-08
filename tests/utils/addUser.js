var vows = require('vows');
var fs = require('fs');
var assert = require('assert');
var mongo = require('mongo');
var users = require(__dirname + '/../../models/users');

var user = JSON.parse(fs.readFileSync(__dirname + '/../fixtures/user.json'));

module.exports = {
  'can get going': {
    topic: function() {
      delete user._id;
      var cb = this.callback;
      mongo.connect(function() {
        mongo.getCollection('users').save(user, cb);
      });
    },
    'with a mock user': function(err, userObj) {
      global.user = userObj;
      assert.equal(user.facebook.auth_token, global.user.facebook.auth_token);
    }
  }
};