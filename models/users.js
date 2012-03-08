var mongo = require('mongo');
var config = require('config');

exports.get = function(userId, callback) {
  mongo.getCollection('users').findOne({_id: new mongo.ObjectID(userId)}, callback);
}

exports.insertObj = function(userId, provider, type, obj, callback) {
  var coll = exports.getCollection(userId, provider, type);
  coll.ensureIndex({id:1}, {unique:true}, function(err) {
    if(err) return callback(err);
    coll.findAndModify({id:obj.id}, [], obj, {upsert:true, multi:false, safe:true}, callback);
  });
}

exports.getCollection = function(userId, provider, type) {
  var collName = 'a' + userId.toString() + '_' + provider + '_' + type;
  return mongo.getCollection(collName);
}