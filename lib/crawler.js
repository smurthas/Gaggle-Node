var mongo = require('mongo');
var async = require('async');
var users = require(__dirname + '/../models/users');

var crawlers = {
  facebook: require(__dirname + '/../crawlers/facebook'),
  // twitter: require('./crawlers/twitter'),
  // instagram: require('./crawlers/instagram'),
  // foursquare: require('./crawlers/foursquare')
};

module.exports.init = function(callback) {
  mongo.connect(callback);
}

module.exports.crawl = function(user, provider, callback) {
  console.error("DEBUG: provider", provider);
  console.error("DEBUG: user", user);
  if (!user[provider]) return callback(new Error('provider ' + provider + ' not authed for user ' + user._id));

  crawlers[provider].sync(user[provider], function(err, datas) {
    async.forEachSeries(datas, function(responseObject, callback) {
      insert(user._id, provider, responseObject.type, responseObject.data, callback);
    }, callback);
  });
}


function insert(userId, provider, type, data, callback) {
  async.forEachSeries(data, function(obj, callback) {
    users.insertObj(userId, provider, type, obj, callback);
  }, callback);
}