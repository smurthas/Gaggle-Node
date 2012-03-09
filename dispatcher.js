var config = require('config');
var crawler = require('crawler');
var redis = require('redis');
var async = require('async');
var providers = ['facebook','twitter','instagram'];

var client = redis.createClient(config.redis.port, config.redis.host, {});
if(config.redis.pass) client.auth(config.redis.pass, function(err) {
  if(err) {
    console.error(err);
    process.exit(1);
  }
});

client.on('ready', function() {
  crawler.init(function() {
    for(var i = 0; i < config.redis.count; i++) process.nextTick(doCrawl);
  })
});


function getNext(callback) {
  client.rpop(config.redis.key, callback);
}

function doCrawl() {
  getNext(function(err, user) {
    if(!user) return setTimeout(doCrawl, config.redis.timeout * 1000);
    if(typeof user === 'string') {
      try {
        user = JSON.parse(user);
      } catch(err) {
        console.error('error parsing user', user);
      }
    }
        // console.error("DEBUG: user", user);
    async.forEach(providers, function(provider, cb) {
      // console.error("DEBUG: provider", provider);
      if(user[provider]) crawler.crawl(user, provider, function(err) {
        //ignore the error here, logged by crawler
        cb();
      });
    }, doCrawl);
  });
}