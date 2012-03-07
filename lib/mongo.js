var config = require('config');

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Collection = mongodb.Collection;
var Server = mongodb.Server;


var db = new Db(config.mongo.db, new Server(config.mongo.host, config.mongo.port, {}), {});

// var connected = false;
module.exports.collections = {};
module.exports.connect = function(callback) {
  // if (connected) return callback(null, client);
  db.open(function(err) {
    if(err) return callback(err);
    for(var i in config.mongo.collections) {
      module.exports.collections[i] = new Collection(db, config.mongo.collections[i]);
    }
    callback();
  });
}

module.exports.ObjectID = mongodb.ObjectID;

module.exports.put = function(collectionName, object, callback) {
  exports.getCollection(collectionName, function(err, collection) {
    collection.ensureIndex('id');
    collection.findAndModify({id:object.id}, object, [], {upsert:true, multi:false, safe:true}, callback);
  });
}