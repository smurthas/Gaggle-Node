var async = require('async');
var tw = require('twitter');
var config = require('config');

tw.init(config.apiKeys.twitter.consumerKey, config.apiKeys.twitter.consumerSecret);

exports.sync = function(userTwObject, callback) {
  getTweets(userTwObject.auth_token, userTwObject.info.screen_name, function(err, tweets) {
    var last_update = 0;
    for(var i in tweets) {
      if(tweets[i].id > last_update) last_update = tweets[i].id;
    }
    callback(err, {data:[{type:'status', data: tweets}], last_update:last_update});
  });
}

exports.map = {
  status: {
    text: 'text',
    source_url: 'link',
    source_creation_date: function(obj) { return new Date(obj.created_at).getTime(); },
    urls: 'urls'
  }
};

function getTweets(token, screen_name, callback) {
  var tweets = [];
  tw.getTweets({screen_name:screen_name, token:{oauth_token:token}}, function(tweet) {tweets.push(tweet)}, function(err) { callback(err, tweets)});
}