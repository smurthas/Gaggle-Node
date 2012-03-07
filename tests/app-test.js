var vows = require('vows');
var fs = require('fs');
var assert = require('assert');
var request = require('request');
var config = require('config');

var server = require(__dirname + '/../server');

var mongo = require('mongo');

var user = JSON.parse(fs.readFileSync(__dirname + '/fixtures/user.json'));

var userObj;

vows.describe('The JSON API').addBatch({
  'can connect to mongo and start a web server': {
    topic: function() {
      server.on('up', this.callback);
    },
    'successfully': function() {
      assert.equal(0,0);
    }
  }
}).addBatch({
  'can get going': {
    topic: function() {
      var cb = this.callback;
      mongo.connect(function() {
        mongo.collections.users.save(user, cb);
      })
    },
    'with some mock data': function(_userObj) {
      userObj = _userObj;
      assert.equal(user.facebook.accessToken, userObj.facebook.accessToken);
    }
  }
}).addBatch({
  'with a post to /start': {
    'without _id and provider': {
      topic: function() {
        request.post({uri:config.app.url + '/start'}, this.callback);
      },
      'gets 400': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 400);
        assert.equal(body, '_id required');
      }
    },
    'with an invalid _id': {
      topic: function() {
        request.post({uri:config.app.url + '/start', json: {_id:'aaaaaaaaaaaa', provider:'facebook'}}, this.callback);
      },
      'gets 400': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 400);
        assert.equal(body, 'user with _id aaaaaaaaaaaa not found');
      }
    },
    'with a valid _id': {
      topic: function() {
        request.post({uri:config.app.url + '/start', json: {_id:userObj._id, provider:'facebook'}}, this.callback);
      },
      'gets 200': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 200);
      }
    }
  }

}).export(module);
