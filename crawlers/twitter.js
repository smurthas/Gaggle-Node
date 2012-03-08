var async = require('async');
var tw = require('twitter');
var config = require('config');

tw.init(config.apiKeys.twitter.consumerKey, config.apiKeys.twitter.consumerSecret);

exports.sync = function(userTwObject, callback) {
  getTweets(userTwObject.auth_token, userTwObject.info.screen_name, function(err, tweets) {
    callback(err, [{type:'status', data: tweets}]);
  });
}

exports.map = {
  status: {
    text: 'text',
    source_url: 'link',
    source_creation_date: function(obj) { return obj.created_time * 1000 }
  }
};

function getTweets(token, screen_name, callback) {
  var tweets = [];
  tw.getTweets({screen_name:screen_name, token:token}, function(tweet) {tweets.push(tweet)}, function(err) { callback(err, tweets)});
}