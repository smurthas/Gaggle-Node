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
  if (!user[provider]) return callback(new Error('provider ' + provider + ' not authed for user ' + user._id));

  crawlers[provider].sync(user[provider], function(err, datas) {
    async.forEachSeries(datas, function(responseObject, callback) {
      insert(user._id, provider, responseObject.type, responseObject.data, callback);
    }, callback);
  });
}

var fields = [
  'text',
  'text_urls',
  'source_creation_date',
  'source_url'
]

function normalizeObject(userId, sourceObj, type, provider) {
  var map = crawlers[provider].map[type];
  var newObject = {
    user_id: userId,
    media_type: type,
    source_id: sourceObj.id,
    _gid: provider + ':' + type + ':' + sourceObj.id,
    provider: provider
  };
  for(var i in fields) {
    var field = fields[i];
    var value = getValue(sourceObj, map, field);
    if(value) newObject[field] = value;
  }
  return newObject;
}

function getValue(sourceObj, map, key) {
  if (typeof map[key] === 'function') return map[key](sourceObj);
  return map[key]? sourceObj[map[key]]: undefined;
}


function insert(userId, provider, type, data, callback) {
  var map = crawlers[provider].map[type];
  async.forEachSeries(data, function(obj, callback) {
    obj = normalizeObject(userId, obj, type, provider);
    users.insertObj(userId, provider, type, obj, callback);
  }, callback);
}