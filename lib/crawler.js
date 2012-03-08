var mongo = require('mongo');
var async = require('async');
var users = require(__dirname + '/../models/users');

var crawlers = {
  facebook: require(__dirname + '/../crawlers/facebook'),
  twitter: require(__dirname + '/../crawlers/twitter'),
  instagram: require(__dirname + '/../crawlers/instagram'),
  // foursquare: require(__dirname + '/../crawlers/foursquare')
};

module.exports.init = function(callback) {
  mongo.connect(callback);
}

module.exports.crawl = function(user, provider, callback) {
  console.log('crawling started for Gaggle user', user._id, 'for', provider);
  if (!user[provider]) {
    console.error('couldn\'t crawl', provider,' for Gaggle user', user);
    return callback(new Error('provider ' + provider + ' not authed for user ' + user._id));
  }

  crawlers[provider].sync(user[provider], function(err, datas) {
    async.forEachSeries(datas, function(responseObject, callback) {
      insert(user, provider, responseObject.type, responseObject.data, callback);
    }, callback);
  });
}

var fields = [
  'text',
  'text_urls',
  'source_creation_date',
  'source_url'
]

function normalizeObject(user, sourceObj, type, provider) {
  var map = crawlers[provider].map[type];
  if(typeof map.filter === 'function' && !map.filter(sourceObj, user)) return;
  var newObject = {
    user_id: user._id,
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


function insert(user, provider, type, data, callback) {
  var map = crawlers[provider].map[type];
  async.forEachSeries(data, function(obj, callback) {
    obj = normalizeObject(user, obj, type, provider);
    if (!obj) return callback();
    users.insertObj(user._id, provider, type, obj, callback);
  }, callback);
}