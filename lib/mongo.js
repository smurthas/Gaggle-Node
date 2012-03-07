var config = require('config');

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Server = mongodb.Server;


var client = new Db(config.mongo.db, new Server(config.mongo.host, config.mongo.port, {}));

var connected = false;
exports.connect = function(callback) {
  if (connected) return callback(null, client);
  client.open(callback);
}

exports.ObjectID = mongodb.ObjectID;

exports.getCollection = function(collectionName, callback) {
  client.collection(collection, callback)
}

exports.put = function(collectionName, object, callback) {
  exports.getCollection(collectionName, function(err, collection) {
    collection.ensureIndex('id');
    collection.findAndModify({id:object.id}, object, [], {upsert:true, multi:false, safe:true}, callback);
  });
}