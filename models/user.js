var mongo = require('mongo');
var config = require('config');

exports.get = function(userId, callback) {
  mongo.collections.users.findOne({_id: new mongo.ObjectID(userId)}, callback);
}