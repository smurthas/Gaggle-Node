var config = require('config');

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Collection = mongodb.Collection;
var Server = mongodb.Server;


var db = new Db(config.mongo.db, new Server(config.mongo.host, config.mongo.port, {}), {});

// var connected = false;
var collections = {};
module.exports.connect = function(callback) {
  // if (connected) return callback(null, client);
  db.open(function(err) {
    if(err) return callback(err);
    callback();
  });
}

module.exports.getCollection = function(collectionName) {
  if(!collections[collectionName]) collections[collectionName] = new Collection(db, collectionName);
  return collections[collectionName];
}

module.exports.ObjectID = mongodb.ObjectID;

module.exports.put = function(collectionName, object, callback) {
  exports.getCollection(collectionName, function(err, collection) {
    // collection.ensureIndex({id:1}, {unique:true}, function(err) {
      // if(err) return callback(err);
      collection.findAndModify({id:object.id}, object, [], {upsert:true, multi:false, safe:true}, callback);
    // });
  });
}

module.exports.dropDatabase = function(callback) {
  db.dropDatabase(callback)
}