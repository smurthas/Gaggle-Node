var vows = require('vows');
var fs = require('fs');
var assert = require('assert');
var request = require('request');
var config = require('config');
var addUser = require(__dirname + '/utils/addUser');
var users = require(__dirname + '/../models/users');
var clean = require(__dirname + '/utils/clean');

var server = require(__dirname + '/../server');

var mongo = require('mongo');


vows.describe('The JSON API').addBatch({
  'can start a web server': {
    topic: function() {
      server.on('up', this.callback);
    },
    'successfully': function() {
      assert.equal(0,0);
    }
  }
}).addBatch(clean).addBatch(addUser).addBatch({
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
        request.post({uri:config.app.url + '/start', json: {_id:global.user._id, provider:'facebook'}}, this.callback);
      },
      'gets 200': function(err, resp, body) {
        assert.isNull(err);
        assert.equal(resp.statusCode, 200);
      }
    }
  }

}).export(module);
