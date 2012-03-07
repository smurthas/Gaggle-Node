var mongo = require('mongo');
var config = require('config');

exports.get = function(userId, callback) {
  mongo.getCollection(config.mongo.collections.users, function(err, collection) {
    collection.findOne({_id: new mongo.ObjectID(userId)}, callback);
  });
}